# PlanWise Frontend

Modern React frontend for the PlanWise productivity platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Dependencies

### Core
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Fast build tool and dev server

### State Management
- **Zustand** - Lightweight state management

### UI Components
- **@dnd-kit** - Drag and drop functionality
- **lucide-react** - Beautiful icon library
- **react-calendar** - Calendar component
- **recharts** - Chart library for analytics

### Utilities
- **axios** - HTTP client for API calls
- **date-fns** - Date utility library

## 🎨 Features

### Pages & Routes
- `/` - Dashboard with insights and overview
- `/tasks` - Task management with drag-and-drop
- `/mood` - Mood tracking and emotional support
- `/sleep` - Sleep logging and debt calculation
- `/skills` - Skill development analytics
- `/calendar` - Campus events and schedule
- `/profile` - User profile and settings
- `/login` - Authentication
- `/register` - User registration

### Key Components

#### Dashboard
- Productivity score display
- Quick stats (points, streak, level)
- Health metrics (mood, sleep, completion rate)
- AI-powered insights
- Today's task preview

#### Tasks
- Drag-and-drop task reordering
- Task creation with detailed options
- Filter by status (all, active, completed)
- Search functionality
- AI-suggested scheduling times
- Priority and category badges
- Cognitive load indicators

#### Mood Check
- Emoji-based mood selection
- Energy level slider (1-10)
- Stress level slider (1-10)
- Optional notes
- Personalized motivational support
- 7-day mood analytics
- Recent check-in history

#### Sleep Tracker
- Date picker for logging
- Hours slept slider (0-12h)
- Sleep quality rating (1-10)
- Sleep debt calculation
- Burnout warnings
- Best/worst night tracking
- 14-day analytics

#### Skills
- Skill progress visualization
- Level-based progression
- Recent activity trends
- Total hours invested
- AI growth suggestions
- Achievement badges

#### Calendar
- Campus event management
- Today's schedule view
- Free time slot detection
- Event type categorization
- Location tracking
- Integrated task timeline

#### Profile
- User information editing
- Productivity preferences
- Deep work hours configuration
- Daily sleep goal setting
- Achievement showcase
- Logout functionality

## 🎯 State Management

### Auth Store
```javascript
{
  user: User | null,
  token: string | null,
  isAuthenticated: boolean,
  setAuth: (user, token) => void,
  logout: () => void,
  updateUser: (userData) => void
}
```

### Task Store
```javascript
{
  tasks: Task[],
  setTasks: (tasks) => void,
  addTask: (task) => void,
  updateTask: (id, updates) => void,
  deleteTask: (id) => void,
  reorderTasks: (tasks) => void
}
```

### Other Stores
- `useMoodStore` - Mood logs management
- `useSleepStore` - Sleep logs management
- `useUIStore` - UI state (modals, sidebar)

## 🎨 Styling

### Design System
- **Colors**: Dark theme with blue/purple gradient accents
- **Typography**: Inter font family
- **Spacing**: Consistent padding and margins
- **Components**: Card-based layouts with glassmorphism

### CSS Variables
```css
--primary: #6366f1
--secondary: #ec4899
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--bg-primary: #0f172a
--bg-secondary: #1e293b
```

### Utility Classes
- `.btn` - Button styles
- `.card` - Card container
- `.input` - Form input
- `.badge` - Status badge
- `.fade-in` - Fade-in animation

## 🔌 API Integration

All API calls are centralized in `src/api/client.js`:

```javascript
import { auth, users, tasks, mood, sleep, skills, analytics, campus } from './api/client';

// Example usage
const response = await tasks.getAll({ completed: false });
const data = response.data;
```

### API Modules
- `auth` - Register, login
- `users` - Get/update profile
- `tasks` - CRUD operations, reordering
- `mood` - Log mood, get analytics
- `sleep` - Log sleep, calculate debt
- `skills` - Get analytics, suggestions
- `analytics` - Dashboard stats, insights
- `campus` - Events, schedule, free slots

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - `md:` 768px and up
  - `lg:` 1024px and up
- **Bottom Navigation**: Easy thumb access on mobile
- **Top Bar**: Sticky header with quick access

## 🔐 Authentication Flow

1. User lands on login/register page
2. Successful auth stores token in localStorage
3. Token automatically added to all API requests
4. Protected routes check authentication status
5. Logout clears token and redirects to login

## 🎮 User Experience

### Animations
- Fade-in on page load
- Smooth transitions on hover
- Loading states for async operations
- Toast notifications for actions

### Feedback
- Success messages for completed actions
- Error handling with user-friendly messages
- Loading spinners during data fetch
- Disabled states during processing

## 🛠️ Development

### Environment Variables
The frontend proxies API requests to `http://localhost:8000` in development. This is configured in `vite.config.js`.

### Code Structure
```
src/
├── components/     # React components
├── api/           # API client and services
├── store.jsx      # Zustand stores
├── App.jsx        # Main app with routing
├── main.jsx       # React entry point
└── index.css      # Global styles
```

### Best Practices
- Functional components with hooks
- Centralized state management
- Reusable API client
- Consistent naming conventions
- Error boundaries (recommended to add)

## 🚢 Deployment

### Build
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview
```bash
npm run preview
```

### Deploy
The build can be deployed to:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**
- **Any static hosting service**

Remember to configure the API base URL for production in `src/api/client.js`.

## 🧪 Testing (Recommended)

Add testing libraries:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

## 📈 Performance

- Code splitting with React.lazy (can be added)
- Optimized images and assets
- Minimal dependencies
- Fast Vite dev server
- Production builds minified and tree-shaken

## 🎯 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Offline support with service workers
- [ ] Push notifications
- [ ] Data export functionality
- [ ] Advanced filtering options
- [ ] Keyboard shortcuts
- [ ] Voice commands
- [ ] Mobile app (React Native)

## 📝 Notes

- All API calls include authentication token automatically
- State persists in localStorage for auth
- Mobile-first responsive design
- No external API keys required

---

**Built with React + Vite for maximum performance** ⚡

