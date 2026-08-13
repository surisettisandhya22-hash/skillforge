import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

import NavigationBar from "../components/NavigationBar/NavigationBar";

import Home from "../pages/Home/Home.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Skills from "../pages/Skills/Skills.jsx";
import Roadmap from "../pages/Roadmap/Roadmap.jsx";
import Projects from "../pages/Projects/Projects";
import Interview from "../pages/Interview/Interview.jsx";
import Notes from "../pages/Notes/Notes.jsx";
import Profile from "../pages/Profile/Profile.jsx";
import Resume from "../pages/Resume/Resume.jsx";
import LearningRoadmap from "../pages/LearningRoadmap/LearningRoadmap";

import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import MigrateData from "../components/MigrateData";


const ProtectedRoute = ({ children, user, loading }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-color, #0f172a)', color: 'white' }}>
        <h2>Loading...</h2>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = ({ user, loading }) => {
  const location = useLocation();
  
  // Do not show the navbar on these specific routes
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <NavigationBar user={user} />}

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/migrate" element={<MigrateData />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute user={user} loading={loading}><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><Dashboard /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute user={user} loading={loading}><Skills /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute user={user} loading={loading}><Roadmap /></ProtectedRoute>} />
        <Route path="/roadmap/:type" element={<ProtectedRoute user={user} loading={loading}><Roadmap /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute user={user} loading={loading}><Projects /></ProtectedRoute>} />

        <Route path="/interview" element={<ProtectedRoute user={user} loading={loading}><Interview /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute user={user} loading={loading}><Notes /></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute user={user} loading={loading}><Resume /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user} loading={loading}><Profile /></ProtectedRoute>} />
        <Route path="/learning/:type" element={<ProtectedRoute user={user} loading={loading}><LearningRoadmap /></ProtectedRoute>} />
      </Routes>
    </>
  );
};

const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <AppContent user={user} loading={loading} />
    </BrowserRouter>
  );
};

export default AppRoutes;