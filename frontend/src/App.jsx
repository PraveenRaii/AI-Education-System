import React, { useEffect, useState } from 'react';
import Home from './pages/HomePage';
import Auth from './pages/AuthPage';
import AdminAuth from './pages/AdminAuthPage';
import Dashboard from './components/Dashboard';
import { apiRequest } from './shared/api';

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('neural_academy_user') || 'null');
    } catch {
      return null;
    }
  });
  const [sessionLoading, setSessionLoading] = useState(Boolean(localStorage.getItem('neural_academy_token')));
  const [theme, setTheme] = useState(() => localStorage.getItem('neural_academy_theme') || 'dark');
  useEffect(() => {
    localStorage.setItem('neural_academy_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!localStorage.getItem('neural_academy_token')) {
      setSessionLoading(false);
      return;
    }
    apiRequest('/auth/me')
      .then((data) => {
        localStorage.setItem('neural_academy_user', JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem('neural_academy_token');
        localStorage.removeItem('neural_academy_user');
        setUser(null);
      })
      .finally(() => setSessionLoading(false));
  }, []);

  function handleLogin(nextUser) {
    localStorage.setItem('neural_academy_user', JSON.stringify(nextUser));
    setUser(nextUser);
  }
  function handleLogout() {
    localStorage.removeItem('neural_academy_token');
    localStorage.removeItem('neural_academy_user');
    setUser(null);
  }

  const [screen, setScreen] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  if (sessionLoading) return <div className="session-loading">Loading your Neural Academy profile…</div>;
  if (user) return <Dashboard user={user} onUserUpdate={setUser} onLogout={handleLogout} theme={theme} setTheme={setTheme} />;
  if (screen === 'admin-auth') return <AdminAuth onLogin={handleLogin} onBack={() => setScreen('home')} />;
  if (screen === 'auth') return <Auth initialMode={authMode} onLogin={handleLogin} onBack={() => setScreen('home')} />;
  return <Home theme={theme} setTheme={setTheme} onOpenAuth={(mode) => { setAuthMode(mode); setScreen('auth'); }} onOpenAdmin={() => setScreen('admin-auth')} />;
}

export default App;
