import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppStore } from './store';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

const ThemeController = () => {
    const { state } = useAppStore();

    useEffect(() => {
        if (state.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [state.theme]);

    return null;
}

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useAppStore();
  
  // In a real app, you might want to show a loading spinner while checking auth status
  if (!state.isAuthenticated && !localStorage.getItem('taskflow_token')) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state } = useAppStore();
    if (state.isAuthenticated || localStorage.getItem('taskflow_token')) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
}

const AppRoutes = () => {
    return (
        <>
        <ThemeController />
        <Routes>
            <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
            <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route
            path="/dashboard"
            element={
                <ProtectedRoute>
                <Dashboard />
                </ProtectedRoute>
            }
            />
            <Route
            path="/profile"
            element={
                <ProtectedRoute>
                <Profile />
                </ProtectedRoute>
            }
            />
             {/* 404 Fallback */}
             <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </>
    )
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;