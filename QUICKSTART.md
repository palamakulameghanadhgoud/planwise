# PlanWise - Quick Start 🚀

## Setup Environment

### 1. Create `.env` file in backend folder
```bash
cd planwise/backend
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

Edit `.env` and set your values (or keep defaults for development):
```env
DATABASE_URL=sqlite:///./planwise.db
SECRET_KEY=your-super-secret-key-change-this
FRONTEND_URL=http://localhost:5173
```

Generate a secure SECRET_KEY:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Run the Application

### 2. Start Backend (Terminal 1)
```bash
cd planwise/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```
Backend runs on: **http://localhost:8000**

### 3. Start Frontend (Terminal 2)
```bash
cd planwise/frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:5173**

### 4. Open Browser
Go to **http://localhost:5173** and register a new account!

---

## What You Get

✅ **No API Keys Required** - Everything works out of the box!
- No Cloudinary
- No external services
- All self-contained

✅ **Full Features**
- Smart task management with AI prioritization
- Mood tracking with emotional support
- Sleep debt monitoring
- Skill analytics
- Campus calendar integration
- Gamification (points, streaks, levels)
- Beautiful dark theme UI

---

## Tech Stack

**Backend:** FastAPI + SQLite + JWT Auth  
**Frontend:** React + Vite + Zustand

**API Docs:** http://localhost:8000/docs

---

That's it! No complex setup, no API keys, just run and go! 🎯

