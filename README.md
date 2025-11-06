# PlanWise 🎯

**AI-Powered Student Productivity Platform**

PlanWise is a personalized productivity app designed specifically for students. It helps manage daily tasks, enhance focus, monitor well-being, and develop skills—all powered by intelligent algorithms that learn from your behavior.

![PlanWise](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Key Features

### 📝 Smart Task Management
- Create, edit, and reorder tasks with drag-and-drop
- Categorize by study, fitness, coding, reading, and more
- AI-powered task prioritization based on urgency and cognitive load
- Visual time-blocking with calendar integration
- Voice input and quick-add shortcuts

### 🤖 AI-Powered Planning
- Learns your behavior, sleep patterns, mood, and workload
- Prioritizes tasks based on urgency, cognitive load, and time of day
- Suggests optimal "deep work slots" and break times
- Adapts recommendations based on your energy levels

### 🎮 Gamification System
- Earn points, badges, and maintain streaks
- Level up as you complete tasks
- Achievement titles: "Focus Ninja", "Deadline Slayer", and more
- Beautiful themes and customization

### 💭 Emotional Support
- Daily mood check-ins: "How do you feel today?"
- Personalized motivational quotes and focus tips
- Intelligent task rescheduling when you're feeling off
- Mood tracking and emotional trend analysis

### 📈 Skill Development
- Tag tasks by domain (coding, writing, organizing, etc.)
- AI analyzes time spent on each skill
- Track progress and get improvement suggestions
- Level-based skill progression system

### 😴 Sleep Debt Management
- Track daily sleep manually or sync with devices
- AI calculates cumulative sleep debt
- Burnout risk warnings
- Automatic task adjustment based on rest levels

### 🔔 Contextual Notifications
- Location and time-based nudges
- Activity-aware suggestions
- Example: "You usually focus well at 9 AM. Start your study session?"

### 📊 Insights & Analytics
- Mood and focus pattern analysis
- Productivity trends and graphs
- Emotional trends vs productivity correlation
- Personalized tips for improving focus

### 🎓 Campus Integration
- Add class schedules and campus events
- Track canteen timings and activities
- Smart task scheduling between classes
- Free time slot suggestions

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd planwise
```

2. **Set up the Backend**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Generate secret key and update .env
python -c "import secrets; print(secrets.token_hex(32))"

# Run the server
python run.py
```

The backend will run on `http://localhost:8000`

3. **Set up the Frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

4. **Access the Application**

Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
planwise/
├── backend/
│   ├── app/
│   │   ├── routers/          # API endpoints
│   │   │   ├── auth.py       # Authentication
│   │   │   ├── tasks.py      # Task management
│   │   │   ├── mood.py       # Mood tracking
│   │   │   ├── sleep.py      # Sleep monitoring
│   │   │   ├── skills.py     # Skill analytics
│   │   │   ├── analytics.py  # Dashboard & insights
│   │   │   └── campus.py     # Campus events
│   │   ├── models.py         # Database models
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── database.py       # Database config
│   │   ├── auth.py           # Auth utilities
│   │   ├── config.py         # App configuration
│   │   └── main.py           # FastAPI app
│   ├── requirements.txt
│   ├── run.py
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── MoodCheck.jsx
│   │   │   ├── SleepTracker.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Calendar.jsx
│   │   │   └── Profile.jsx
│   │   ├── api/             # API client
│   │   ├── store.jsx        # State management
│   │   ├── App.jsx          # Main app
│   │   └── index.css        # Styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🎨 Design Philosophy

### Branding & UX
- **Slick Interface**: Dark theme with calm visuals
- **Smart Feature Names**: "Zen Sprint Mode", "Sleep Sync", "Mission Reactor"
- **Intuitive Navigation**: Bottom navigation for mobile-first experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## 🔑 Key Differentiators

| Feature | PlanWise | Others |
|---------|----------|---------|
| **AI Emotional Adaptation** | ✅ Adjusts task plans based on mood | ❌ Most apps don't |
| **Sleep-Based Productivity** | ✅ Connects sleep to task performance | ❌ Rarely connected |
| **Skill Analytics** | ✅ Provides growth insights | ❌ Few apps do this |
| **Gamified with Realism** | ✅ Fun + personalized tracking | ⚠️ Usually one or the other |
| **Context-Aware Notifications** | ✅ Smarter than time-based | ⚠️ Basic in most apps |
| **No External API Keys** | ✅ Self-contained system | ⚠️ Most require cloud services |

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **JWT** - Secure authentication
- **Pydantic** - Data validation
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Zustand** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **dnd-kit** - Drag and drop
- **Lucide React** - Icons
- **Recharts** - Charts (optional)

## 📖 API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🎯 Usage Examples

### Creating a Task
1. Navigate to Tasks tab
2. Click "New Task"
3. Fill in details (title, category, priority, cognitive load)
4. AI will suggest the best time to complete it
5. Drag to reorder tasks

### Mood Check-in
1. Go to Mood tab
2. Select your current mood
3. Rate energy and stress levels
4. Get personalized motivational support

### Sleep Tracking
1. Visit Sleep tab
2. Log hours slept and quality
3. View sleep debt calculation
4. Get recommendations to avoid burnout

### Skill Development
1. Complete tasks in different categories
2. Visit Skills tab to see your progress
3. View hours invested per skill
4. Get AI suggestions for balanced growth

## 🔒 Security

- Passwords hashed with bcrypt
- JWT token-based authentication
- Secure HTTP-only cookies (optional)
- No external API keys required
- All data stored locally

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with modern best practices
- Inspired by the needs of real students
- Designed for maximum productivity and well-being

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ for students who want to achieve more while staying balanced**

**PlanWise** - Plan Smarter, Live Better 🎯

