import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './pages/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Posts from './pages/posts';
import ProjectBoard from './pages/ProjectBoard';

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token'); // assuming token is stored on login

  // Routes where you don't want to show the Navbar
  const hideNavbarOnRoutes = ['/', '/login', '/register'];
  const hideNavbar = hideNavbarOnRoutes.includes(location.pathname) || !isAuthenticated;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/projects" element={<ProjectBoard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Box>
  );
}

export default App;
