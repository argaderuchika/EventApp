import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(90deg, #007bff, #00d4ff)', 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Brand Name */}
        <Typography 
          variant="h6" 
          sx={{ fontWeight: 'bold', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        >
          EventApp
        </Typography>

        {/* Navigation Buttons */}
        <Box>
          {user && user.userRole === "admin" && (
            <Button 
              color="inherit" 
              sx={{ mx: 1, fontSize: '16px', fontWeight: '500', '&:hover': { color: '#FFD700' } }} 
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
          )}

          {user && (
            <Button 
              color="inherit" 
              sx={{ mx: 1, fontSize: '16px', fontWeight: '500', '&:hover': { color: '#FFD700' } }} 
              onClick={() => navigate('/events')}
            >
              Events
            </Button>
          )}
          
          {!user ? (
            <>
              <Button 
                color="inherit" 
                sx={{ mx: 1, fontSize: '16px', fontWeight: '500', '&:hover': { color: '#FFD700' } }} 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                sx={{ mx: 1, fontSize: '16px', fontWeight: '500', background: '#FFD700', color: '#000', '&:hover': { background: '#FFC107' } }} 
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          ) : (
            <Button 
              color="inherit" 
              sx={{ mx: 1, fontSize: '16px', fontWeight: '500', background: '#ff4d4d', color: '#fff', '&:hover': { background: '#ff1a1a' } }} 
              onClick={handleLogout}
            >
              Logout
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
