# OAuth Setup Guide for PlanWise

## Google OAuth Setup

1. **Go to Google Cloud Console:** https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`
   - (For production, add your production URL too)
5. **Copy your credentials:**
   - Client ID
   - Client Secret
6. **Add to `.env` file:**
   ```
   GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

## GitHub OAuth Setup

1. **Go to GitHub Settings:** https://github.com/settings/developers
2. **Create a new OAuth App:**
   - Click "New OAuth App"
   - Application name: "PlanWise"
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:8000/api/auth/github/callback`
3. **Generate a client secret**
4. **Copy your credentials:**
   - Client ID
   - Client Secret
5. **Add to `.env` file:**
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

## Testing OAuth

1. After adding credentials to `.env`, restart the backend server
2. The OAuth buttons will appear on the login page
3. Click "Sign in with Google" or "Sign in with GitHub"
4. You'll be redirected to authorize the app
5. After authorization, you'll be logged into PlanWise

## Production Setup

For production deployment:
1. Update redirect URIs to use your production domain
2. Update `FRONTEND_URL` in `.env` to your production frontend URL
3. Update OAuth app settings in Google Cloud Console and GitHub
4. Use secure HTTPS URLs

