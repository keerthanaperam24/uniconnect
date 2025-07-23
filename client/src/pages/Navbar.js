import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          UniConnect
        </Typography>
        <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
        <Button color="inherit" onClick={() => navigate('/posts')}>Post</Button>
        <Button color="inherit" onClick={() => navigate('/projects')}>Projects</Button>
        <Button color="inherit" onClick={() => navigate('/profile')}>Profile</Button>
        {token ? (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;