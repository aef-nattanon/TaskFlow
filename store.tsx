import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, User, Category } from './types';
import { api } from './lib/api';

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
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
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
  tasks: [],
  categories: [],
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
      return { ...state, user: null, tasks: [], categories: [], isAuthenticated: false };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_USER':
      if (!state.user) return state;
      return { ...state, user: { ...state.user, ...action.payload } };
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

  // Restore auth from token
  useEffect(() => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      Promise.all([api.getMe(), api.getTasks(), api.getCategories()])
        .then(([userData, tasksData, catsData]) => {
          dispatch({ type: 'LOGIN', payload: userData.user });
          dispatch({ type: 'SET_TASKS', payload: tasksData.tasks });
          dispatch({ type: 'SET_CATEGORIES', payload: catsData.categories });
        })
        .catch(() => {
          localStorage.removeItem('taskflow_token');
        });
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
