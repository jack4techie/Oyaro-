
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Directory from './components/Directory';
import EventCalendar from './components/EventCalendar';
import RecipeBook from './components/RecipeBook';
import FamilyHistorian from './components/FamilyHistorian';
import Gallery from './components/Gallery';
import Profile from './components/Profile';
import Shop from './components/Shop';
import { AppRoute, User } from './types';
import { AppProvider } from './context/AppContext';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Updated storage key for Maonda Foundation
    const storedUser = localStorage.getItem('maonda_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    localStorage.setItem('maonda_user', JSON.stringify(u));
    setUser(u);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('maonda_user', JSON.stringify(updatedUser));

    // Also update the 'database' so changes persist across logins
    try {
      const dbUsers = JSON.parse(localStorage.getItem('maonda_db_users') || '[]');
      const index = dbUsers.findIndex((u: any) => u.id === updatedUser.id);
      if (index !== -1) {
          // Merge updates while preserving the password
          dbUsers[index] = { ...dbUsers[index], ...updatedUser };
          localStorage.setItem('maonda_db_users', JSON.stringify(dbUsers));
      }
    } catch (e) {
      console.error("Failed to sync user update to DB", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('maonda_user');
    setUser(null);
  };

  if (isLoading) return null;

  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route path={AppRoute.HOME} element={!user ? <Landing /> : <Navigate to={AppRoute.DASHBOARD} replace />} />
          <Route path={AppRoute.LOGIN} element={!user ? <Login onLogin={handleLogin} /> : <Navigate to={AppRoute.DASHBOARD} replace />} />
          <Route path={AppRoute.REGISTER} element={!user ? <Register /> : <Navigate to={AppRoute.DASHBOARD} replace />} />

          {/* Protected Routes */}
          <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to={AppRoute.LOGIN} replace />}>
            <Route path={AppRoute.DASHBOARD} element={<Dashboard />} />
            <Route path={AppRoute.DIRECTORY} element={<Directory />} />
            <Route path={AppRoute.CALENDAR} element={<EventCalendar />} />
            <Route path={AppRoute.RECIPES} element={<RecipeBook />} />
            <Route path={AppRoute.STORIES} element={<FamilyHistorian />} />
            <Route path={AppRoute.GALLERY} element={<Gallery />} />
            <Route path={AppRoute.PROFILE} element={<Profile user={user as User} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />} />
            <Route path={AppRoute.SHOP} element={<Shop />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to={AppRoute.HOME} replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
