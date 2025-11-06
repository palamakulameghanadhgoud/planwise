# PlanWise Backend

AI-powered student productivity platform backend built with FastAPI.

## Features

- 🔐 JWT Authentication
- ✅ Task Management with AI Prioritization
- 😊 Mood Tracking & Emotional Support
- 😴 Sleep Tracking & Debt Calculation
- 📊 Skill Analytics & Growth Tracking
- 🏆 Gamification (Points, Streaks, Achievements)
- 📅 Campus Schedule Integration
- 📈 Productivity Insights & Analytics

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Generate a secret key:
```bash
openssl rand -hex 32
```
Update the `SECRET_KEY` in your `.env` file with the generated key.

5. Run the server:
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Tasks
- `POST /api/tasks/` - Create task
- `GET /api/tasks/` - Get tasks (with filters)
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `POST /api/tasks/reorder` - Reorder tasks

### Mood
- `POST /api/mood/` - Log mood
- `GET /api/mood/` - Get mood history
- `GET /api/mood/support` - Get emotional support
- `GET /api/mood/analytics` - Get mood analytics

### Sleep
- `POST /api/sleep/` - Log sleep
- `GET /api/sleep/` - Get sleep history
- `GET /api/sleep/debt` - Calculate sleep debt
- `GET /api/sleep/analytics` - Get sleep analytics

### Skills
- `GET /api/skills/` - Get user skills
- `GET /api/skills/analytics` - Get skill analytics
- `GET /api/skills/suggestions` - Get skill suggestions

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats
- `GET /api/analytics/insights` - Get productivity insights
- `GET /api/analytics/productivity-score` - Calculate score

### Campus
- `POST /api/campus/events` - Create campus event
- `GET /api/campus/events` - Get campus events
- `GET /api/campus/schedule/today` - Get today's schedule
- `GET /api/campus/free-slots` - Get free time slots

## Database

The app uses SQLite by default. The database file (`planwise.db`) will be created automatically on first run.

## Architecture

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **Pydantic** - Data validation
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

## No External API Keys Required

Unlike typical apps, PlanWise doesn't require any third-party API keys for:
- Cloud storage (no Cloudinary)
- Email services
- Payment processing
- External AI services

All features are self-contained!

