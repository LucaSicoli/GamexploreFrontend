// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchUserData } from '../redux/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { games, loading, error } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchUserData());
  }, [dispatch]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (loading) {
    return <Typography sx={{ color: 'white' }}>Loading...</Typography>;
  }

  if (error) {
    return <Typography sx={{ color: 'white' }}>Error: {error}</Typography>;
  }

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#041C32', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', fontFamily: 'Orbitron', textAlign: 'center' }}>
        My Games
      </Typography>

      {games && games.length > 0 ? (
        games.map((game) => (
          <Box
            key={game.id}
            sx={{
              backgroundColor: '#062A56',
              padding: '1rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              color: 'white',
            }}
          >
            <Box display="flex" alignItems="center" gap="1rem">
              <img
                src={game.imageUrl}
                alt={game.name}
                style={{ width: 80, height: 80, borderRadius: '10px' }}
              />
              <Box>
                <Typography variant="h6">{game.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Published on {game.publishedDate}
                </Typography>
                <Typography variant="body2">Rating: {game.rating}</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap="1rem">
              <Typography variant="body2">Views: {game.views}</Typography>
              <Typography variant="body2">Wishlist: {game.wishlist}</Typography>
              <Typography variant="body2">Purchases: {game.purchases}</Typography>
              <Typography variant="body2">Conversion Rate: {game.conversionRate}%</Typography>
              <IconButton aria-label="more" onClick={handleMenuClick} sx={{ color: 'white' }}>
                <MoreVertIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                <MenuItem onClick={handleMenuClose}>Publish/Unpublish</MenuItem>
                <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
              </Menu>
            </Box>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
          No games found.
        </Typography>
      )}
    </Box>
  );
};

export default Profile;
