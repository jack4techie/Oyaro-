
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
import MemberProfile from './components/MemberProfile';
import Shop from './components/Shop';
import FamilyTree from './components/FamilyTree';
import Memorial from './components/Memorial';
import LearningHub from './components/Learning/LearningHub'; // New
import CourseViewer from './components/Learning/CourseViewer'; // New
import { AppRoute, User } from './types';
import { AppProvider } from './context/AppContext';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    authService.setSession(u);
    setUser(u);
  };

  const handleUpdateUser = async (updatedUser: User) => {
    // Optimistic UI update
    setUser(updatedUser);
    authService.setSession(updatedUser);

    // Sync to backend DB
    try {
      await authService.updateProfile(updatedUser);
    } catch (e) {
      console.error("Failed to sync user update to DB", e);
    }
  };

  const handleLogout = () => {
    authService.logout();
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
            <Route path={AppRoute.FAMILY_TREE} element={<FamilyTree />} />
            <Route path={AppRoute.MEMBER} element={<MemberProfile />} />
            <Route path={AppRoute.MEMORIAL} element={<Memorial />} />
            <Route path={AppRoute.LEARNING} element={<LearningHub />} /> {/* New */}
            <Route path={AppRoute.COURSE} element={<CourseViewer />} /> {/* New */}
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
