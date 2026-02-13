import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, User, Category, Priority, TaskStatus } from './types';
import { MOCK_TASKS, DEFAULT_CATEGORIES } from './constants';

interface AppState {
  user: User | null;
  tasks: Task[];
  categories: Category[];
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_STATUS'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'TOGGLE_THEME' };

const getInitialTheme = (): 'light' | 'dark' => {
  const storedTheme = localStorage.getItem('taskflow_theme');
  if (storedTheme === 'dark' || storedTheme === 'light') {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialState: AppState = {
  user: null,
  tasks: MOCK_TASKS,
  categories: DEFAULT_CATEGORIES,
  isAuthenticated: false,
  theme: getInitialTheme(),
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'ADD_TASK':
      // Assign an order that puts it at the top or bottom. Here we put it at top (smaller order).
      const minOrder = state.tasks.length > 0 ? Math.min(...state.tasks.map(t => t.order)) : 0;
      const taskWithOrder = { ...action.payload, order: minOrder - 100 };
      return { ...state, tasks: [taskWithOrder, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'TOGGLE_TASK_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload
            ? {
                ...t,
                status: t.status === 'Active' ? 'Completed' : 'Active',
                completedAt: t.status === 'Active' ? new Date().toISOString() : undefined,
              }
            : t
        ),
      };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_USER':
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem('taskflow_user', JSON.stringify(updatedUser));
      return { ...state, user: updatedUser };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('taskflow_theme', newTheme);
      return { ...state, theme: newTheme };
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Simulate persistent auth check
  useEffect(() => {
    const storedUser = localStorage.getItem('taskflow_user');
    if (storedUser) {
      dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};