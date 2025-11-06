from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .routers import auth, users, tasks, mood, sleep, skills, analytics, campus
from .config import settings

app = FastAPI(
    title="PlanWise API",
    description="AI-Powered Student Productivity Platform",
    version="1.0.0"
)

# Session middleware - required for OAuth
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(mood.router)
app.include_router(sleep.router)
app.include_router(skills.router)
app.include_router(analytics.router)
app.include_router(campus.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to PlanWise API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

