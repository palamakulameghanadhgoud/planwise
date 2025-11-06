import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) => set((state) => ({ user: { ...state.user, ...userData } })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useTaskStore = create((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
    })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  reorderTasks: (tasks) => set({ tasks }),
}));

export const useMoodStore = create((set) => ({
  moods: [],
  latestMood: null,
  setMoods: (moods) => set({ moods }),
  setLatestMood: (mood) => set({ latestMood: mood }),
  addMood: (mood) =>
    set((state) => ({ moods: [mood, ...state.moods], latestMood: mood })),
}));

export const useSleepStore = create((set) => ({
  sleepLogs: [],
  sleepDebt: null,
  setSleepLogs: (logs) => set({ sleepLogs: logs }),
  setSleepDebt: (debt) => set({ sleepDebt: debt }),
  addSleepLog: (log) => set((state) => ({ sleepLogs: [log, ...state.sleepLogs] })),
}));

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  modalOpen: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openModal: (modalName) => set({ modalOpen: modalName }),
  closeModal: () => set({ modalOpen: null }),
}));

