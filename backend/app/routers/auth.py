from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from datetime import timedelta, datetime
from authlib.integrations.starlette_client import OAuth
import httpx
from ..database import users_collection
from ..schemas import UserCreate, UserLogin, Token, UserResponse
from ..auth import get_password_hash, verify_password, create_access_token
from ..config import settings
from bson import ObjectId
import secrets

router = APIRouter(prefix="/api/auth", tags=["auth"])

# OAuth setup
oauth = OAuth()

# Google OAuth
if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name='google',
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid email profile'}
    )

# GitHub OAuth
if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
    oauth.register(
        name='github',
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        authorize_url='https://github.com/login/oauth/authorize',
        access_token_url='https://github.com/login/oauth/access_token',
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'}
    )

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    # Check if user already exists
    if await users_collection.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if await users_collection.find_one({"username": user_data.username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user_dict = {
        "email": user_data.email,
        "username": user_data.username,
        "full_name": user_data.full_name,
        "hashed_password": hashed_password,
        "bio": None,
        "total_points": 0,
        "current_streak": 0,
        "longest_streak": 0,
        "level": 1,
        "preferred_deep_work_start": 9,
        "preferred_deep_work_end": 12,
        "daily_sleep_goal": 8.0,
        "created_at": datetime.utcnow()
    }
    
    result = await users_collection.insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    user_dict.pop("_id", None)
    user_dict.pop("hashed_password", None)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_dict["id"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_dict
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    user["id"] = str(user["_id"])
    user.pop("_id", None)
    user.pop("hashed_password", None)
    
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

# Google OAuth endpoints
@router.get("/google/login")
async def google_login(request: Request):
    """Redirect to Google OAuth login"""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth callback"""
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    
    try:
        # Get access token
        token = await oauth.google.authorize_access_token(request)
        print(f"Token received: {list(token.keys()) if token else 'None'}")
        
        # Get user info - try different methods
        user_info = None
        
        # Method 1: Check if userinfo is in token
        if token and 'userinfo' in token:
            user_info = token['userinfo']
            print("Got userinfo from token")
        
        # Method 2: Use authlib's built-in method
        if not user_info:
            try:
                user_info = await oauth.google.parse_id_token(request, token)
                print("Got userinfo from parse_id_token")
            except:
                pass
        
        # Method 3: Fetch from userinfo endpoint
        if not user_info and token and 'access_token' in token:
            try:
                async with httpx.AsyncClient() as client:
                    headers = {"Authorization": f"Bearer {token['access_token']}"}
                    resp = await client.get('https://openidconnect.googleapis.com/v1/userinfo', headers=headers)
                    if resp.status_code == 200:
                        user_info = resp.json()
                        print("Got userinfo from API call")
            except Exception as e:
                print(f"Error fetching userinfo: {e}")
        
        if not user_info:
            error_msg = f"No userinfo found. Token keys: {list(token.keys()) if token else 'No token'}"
            print(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        
        # Extract email
        email = user_info.get('email')
        if not email:
            print(f"User info received: {user_info}")
            raise HTTPException(status_code=400, detail="Email not provided by Google")
        
        print(f"Processing user: {email}")
        
        # Check if user exists
        user = await users_collection.find_one({"email": email})
        
        if not user:
            # Create new user from OAuth
            username_base = email.split('@')[0]
            username = username_base + "_" + secrets.token_hex(3)
            
            # Ensure username is unique
            counter = 0
            while await users_collection.find_one({"username": username}):
                username = username_base + "_" + secrets.token_hex(3) + str(counter)
                counter += 1
            
            user_dict = {
                "email": email,
                "username": username,
                "full_name": user_info.get('name') or user_info.get('given_name', ''),
                "hashed_password": get_password_hash(secrets.token_urlsafe(32)),
                "bio": None,
                "total_points": 0,
                "current_streak": 0,
                "longest_streak": 0,
                "level": 1,
                "preferred_deep_work_start": 9,
                "preferred_deep_work_end": 12,
                "daily_sleep_goal": 8.0,
                "oauth_provider": "google",
                "oauth_id": user_info.get('sub'),
                "created_at": datetime.utcnow()
            }
            result = await users_collection.insert_one(user_dict)
            user_dict["id"] = str(result.inserted_id)
            user_dict.pop("_id", None)
            user_dict.pop("hashed_password", None)
            user = user_dict
            print(f"Created new user: {user['id']}")
        else:
            user["id"] = str(user["_id"])
            user.pop("_id", None)
            user.pop("hashed_password", None)
            print(f"Found existing user: {user['id']}")
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["id"]},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        print(f"Redirecting to frontend with token")
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/oauth-callback?token={access_token}&user={user['id']}"
        )
    
    except HTTPException as e:
        print(f"HTTPException: {e.detail}")
        raise
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"Unexpected error: {error_trace}")
        error_detail = f"OAuth error: {str(e)}\n{error_trace}"
        raise HTTPException(status_code=500, detail=error_detail)

# GitHub OAuth endpoints
@router.get("/github/login")
async def github_login(request: Request):
    """Redirect to GitHub OAuth login"""
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(status_code=501, detail="GitHub OAuth not configured")
    
    redirect_uri = settings.GITHUB_REDIRECT_URI
    return await oauth.github.authorize_redirect(request, redirect_uri)

@router.get("/github/callback")
async def github_callback(request: Request):
    """Handle GitHub OAuth callback"""
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(status_code=501, detail="GitHub OAuth not configured")
    
    try:
        token = await oauth.github.authorize_access_token(request)
        
        # Get user info from GitHub
        resp = await oauth.github.get('user', token=token)
        user_info = resp.json()
        
        # Get user email (might be private)
        email_resp = await oauth.github.get('user/emails', token=token)
        emails = email_resp.json()
        email = next((e['email'] for e in emails if e['primary']), user_info.get('email'))
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not available from GitHub")
        
        # Check if user exists
        user = await users_collection.find_one({"email": email})
        
        if not user:
            # Create new user from OAuth
            user_dict = {
                "email": email,
                "username": user_info.get('login', email.split('@')[0]),
                "full_name": user_info.get('name') or user_info.get('login'),
                "hashed_password": get_password_hash(secrets.token_urlsafe(32)),
                "bio": user_info.get('bio'),
                "total_points": 0,
                "current_streak": 0,
                "longest_streak": 0,
                "level": 1,
                "preferred_deep_work_start": 9,
                "preferred_deep_work_end": 12,
                "daily_sleep_goal": 8.0,
                "oauth_provider": "github",
                "oauth_id": str(user_info.get('id')),
                "created_at": datetime.utcnow()
            }
            result = await users_collection.insert_one(user_dict)
            user_dict["id"] = str(result.inserted_id)
            user_dict.pop("_id", None)
            user_dict.pop("hashed_password", None)
            user = user_dict
        else:
            user["id"] = str(user["_id"])
            user.pop("_id", None)
            user.pop("hashed_password", None)
        
        # Create access token
        access_token = create_access_token(
            data={"sub": user["id"]},
            expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/oauth-callback?token={access_token}&user={user['id']}"
        )
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"OAuth error: {str(e)}")
