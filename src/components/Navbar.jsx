import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Typography, Drawer, List, ListItem, ListItemText, Badge } from '@mui/material';
import { Home, ShoppingCart, Favorite, AccountCircle, Logout, Menu as MenuIcon, AddBox } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { fetchCart } from '../redux/cartSlice'; // Import fetchCart action for cart fetching

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Extract user and cart items count from Redux state
  const user = useSelector((state) => state.auth.user);
  const totalItems = useSelector((state) => state.cart.totalItems);

  useEffect(() => {
    if (user?.role !== 'empresa') {
      // Fetch cart data on navbar mount to update cart count if not a company
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    setAnchorEl(null);
    navigate('/login');
  };

  const toggleDrawer = (open) => () => {
    setIsDrawerOpen(open);
  };

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(0deg, #062A56 0%, #03152B 100%)', padding: { xs: '0.5rem 1rem', md: '0.5rem 2rem' } }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: { xs: '56px', md: '64px' } }}>
        
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src="/images/logo.png" alt="Gamexplore Logo" style={{ height: '72px' }} />
        </Box>

        {/* Hamburger Menu for Small Screens */}
        <IconButton color="inherit" edge="end" onClick={toggleDrawer(true)} sx={{ display: { xs: 'block', md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        {/* Navigation Buttons for Larger Screens */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '2rem', alignItems: 'center', marginLeft: 'auto', paddingRight: '3rem' }}>
          <Box sx={{ textAlign: 'center' }}>
            <IconButton color="inherit" onClick={() => navigate('/')}>
              <Home />
            </IconButton>
            <Typography variant="body2" color="inherit" sx={{ fontFamily: 'Orbitron' }}>Inicio</Typography>
          </Box>

          {/* Cart and Wishlist Icons Only for Non-Company Users */}
          {user?.role !== 'empresa' && (
            <>
              <Box sx={{ textAlign: 'center' }}>
                <IconButton color="inherit" onClick={() => navigate('/cart')}>
                  <Badge badgeContent={totalItems} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
                <Typography variant="body2" color="inherit" sx={{ fontFamily: 'Orbitron' }}>Carrito</Typography>
              </Box>

              <Box sx={{ textAlign: 'center' }}>
                <IconButton color="inherit" onClick={() => navigate('/wishlist')}>
                  <Favorite />
                </IconButton>
                <Typography variant="body2" color="inherit" sx={{ fontFamily: 'Orbitron' }}>Wishlist</Typography>
              </Box>
            </>
          )}

          {/* "Add Game" button for companies */}
          {user?.role === 'empresa' && (
            <Box sx={{ textAlign: 'center' }}>
              <IconButton color="inherit" onClick={() => navigate('/create-game')}>
                <AddBox />
              </IconButton>
              <Typography variant="body2" color="inherit" sx={{ fontFamily: 'Orbitron' }}>Add Game</Typography>
            </Box>
          )}

          {/* Profile Icon */}
          <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '72px' }}>
            <IconButton 
              color="inherit" 
              onClick={handleProfileClick} 
              sx={{ display: 'flex', alignItems: 'center', padding: 0 }}
            >
              {user?.role === 'empresa' && user.logo ? (
                <img src={user.logo} alt="Company Logo" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
              ) : (
                <AccountCircle style={{ fontSize: '48px' }} />
              )}
            </IconButton>
          </Box>

          {/* Profile Dropdown Menu */}
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} sx={{ mt: '45px' }} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={() => navigate('/profile')}>Perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>

        {/* Drawer for Small Screens */}
        <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)} sx={{ '& .MuiDrawer-paper': { backgroundColor: '#1e1e1e', color: 'white', width: 250 } }}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
              <ListItem button onClick={() => navigate('/')}>
                <Home sx={{ color: 'white' }} />
                <ListItemText primary="Inicio" sx={{ color: 'white', marginLeft: 2 }} />
              </ListItem>

              {/* Cart and Wishlist Only for Non-Company Users in Drawer */}
              {user?.role !== 'empresa' && (
                <>
                  <ListItem button onClick={() => navigate('/cart')}>
                    <Badge badgeContent={totalItems} color="secondary">
                      <ShoppingCart sx={{ color: 'white' }} />
                    </Badge>
                    <ListItemText primary="Carrito" sx={{ color: 'white', marginLeft: 2 }} />
                  </ListItem>
                  <ListItem button onClick={() => navigate('/wishlist')}>
                    <Favorite sx={{ color: 'white' }} />
                    <ListItemText primary="Wishlist" sx={{ color: 'white', marginLeft: 2 }} />
                  </ListItem>
                </>
              )}

              {/* "Add Game" button for companies in Drawer */}
              {user?.role === 'empresa' && (
                <ListItem button onClick={() => navigate('/create-game')}>
                  <AddBox sx={{ color: 'white' }} />
                  <ListItemText primary="Add Game" sx={{ color: 'white', marginLeft: 2 }} />
                </ListItem>
              )}

              <ListItem button onClick={() => navigate('/profile')}>
                {user?.role === 'empresa' && user.logo ? (
                  <img src={user.logo} alt="Company Logo" style={{ width: '24px', height: '24px', borderRadius: '50%', marginRight: '8px' }} />
                ) : (
                  <AccountCircle sx={{ color: 'white' }} />
                )}
                <ListItemText primary="Perfil" sx={{ color: 'white', marginLeft: 2 }} />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <Logout sx={{ color: 'white' }} />
                <ListItemText primary="Cerrar sesión" sx={{ color: 'white', marginLeft: 2 }} />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
