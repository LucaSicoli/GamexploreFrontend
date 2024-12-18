// src/pages/Profile.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Rating,
  TextField,
  InputAdornment,
  useMediaQuery,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import Navbar from '../components/Navbar';
import { fetchUserGames } from '../redux/userSlice';
import { getWishlist } from '../redux/wishlistSlice';
import { incrementGameViews } from '../redux/gameSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { games, loading, error } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)'); // Detecta si es mobile

  useEffect(() => {
    dispatch(fetchUserGames());
    dispatch(getWishlist());
  }, [dispatch]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleIncrementViews = (gameId) => {
    dispatch(incrementGameViews(gameId));
  };

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchTerm)
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <>
      <Navbar />
      <Box sx={{ padding: '2rem', backgroundColor: '#041C32', minHeight: '100vh' }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection={{ xs: 'column', sm: 'row' }}
          mb={3}
          gap={{ xs: 2, sm: 4 }}
        >
          <Box display="flex" alignItems="center" gap={1} sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: 'white',
                fontFamily: 'Orbitron, sans-serif',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              My Games
            </Typography>
            <IconButton sx={{ color: 'white', fontSize: '2.5rem' }}>
              <AssessmentIcon fontSize="inherit" />
            </IconButton>
          </Box>

          <TextField
            variant="outlined"
            placeholder="Buscar juego"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: 'white',
              borderRadius: '5px',
              maxWidth: { xs: '80%', sm: '300px' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#062A56',
                },
                '&:hover fieldset': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider
          sx={{
            width: '100%',
            maxWidth: { xs: '80%', sm: '800px' },
            backgroundColor: 'white',
            margin: '0 auto',
            marginTop: '1rem',
            marginBottom: '2rem',
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ maxWidth: '800px', width: '100%' }}>
            {filteredGames && filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <Box
                  key={game._id}
                  sx={{
                    backgroundColor: 'rgba(202, 202, 202, 0.3)',
                    padding: '1rem 2rem',
                    borderRadius: '15px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: isMobile ? 'center' : 'space-between',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    marginBottom: '1.5rem',
                    color: 'white',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                  }}
                  onClick={() => handleIncrementViews(game._id)}
                >
                  {/* Imagen del juego */}
                  <img
                    src={game.imageUrl}
                    alt={game.name}
                    style={{
                      width: isMobile ? '100%' : '90px',
                      height: isMobile ? 'auto' : '90px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      marginBottom: isMobile ? '1rem' : '0',
                    }}
                  />

                  {/* Contenido en mobile */}
                  {isMobile ? (
                    <>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
                        {game.name}
                      </Typography>
                      <Typography variant="body2" color="white" textAlign="center">
                        {game.isPublished ? 'Publicado' : 'Despublicado'} el {game.publishedDate || 'N/A'}
                      </Typography>
                      <Box display="flex" justifyContent="center" alignItems="center" gap="0.5rem" mt={0.5}>
                        <Rating value={game.rating || 0} readOnly precision={0.1} />
                        <Typography variant="body2">
                          {game.rating?.toFixed(1) || 0} ({game.ratingCount || 0} reseñas)
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-around" width="100%" mt={1}>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <VisibilityIcon fontSize="small" />
                          <Typography variant="body2">{game.views || 0}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <FavoriteIcon fontSize="small" />
                          <Typography variant="body2">{game.wishlistCount || 0}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <ShoppingCartIcon fontSize="small" />
                          <Typography variant="body2">{game.purchases || 0}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <TrendingUpIcon fontSize="small" />
                          <Typography variant="body2">{game.conversionRate || 0}%</Typography>
                        </Box>
                      </Box>
                      <Box display="flex" justifyContent="center" mt={1}>
                        <IconButton
                          aria-label="more"
                          onClick={handleMenuClick}
                          sx={{ color: 'white' }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                          <MenuItem onClick={handleMenuClose}>
                            {game.isPublished ? 'Despublicar' : 'Publicar'}
                          </MenuItem>
                          <MenuItem onClick={handleMenuClose}>Eliminar</MenuItem>
                        </Menu>
                      </Box>
                    </>
                  ) : (
                    // Contenido en escritorio
                    <>
                      <Box display="flex" alignItems="center" gap="1.5rem" flexWrap="wrap">
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            {game.name}
                          </Typography>
                          <Typography variant="body2" color="white">
                            {game.isPublished ? 'Publicado' : 'Despublicado'} el {game.publishedDate || 'N/A'}
                          </Typography>
                          <Box display="flex" alignItems="center" gap="0.5rem" mt={0.5}>
                            <Rating value={game.rating || 0} readOnly precision={0.1} />
                            <Typography variant="body2">
                              {game.rating?.toFixed(1) || 0} ({game.ratingCount || 0} reseñas)
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" gap="2rem" flexWrap="wrap">
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <VisibilityIcon fontSize="small" />
                          <Typography variant="body2">{game.views || 0}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <FavoriteIcon fontSize="small" />
                          <Typography variant="body2">{game.wishlistCount || 0}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <ShoppingCartIcon fontSize="small" />
                          <Typography variant="body2">{game.purchases || 0}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <TrendingUpIcon fontSize="small" />
                          <Typography variant="body2">{game.conversionRate || 0}%</Typography>
                        </Box>
                        <IconButton
                          aria-label="more"
                          onClick={handleMenuClick}
                          sx={{ color: 'white' }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                          <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                          <MenuItem onClick={handleMenuClose}>
                            {game.isPublished ? 'Despublicar' : 'Publicar'}
                          </MenuItem>
                          <MenuItem onClick={handleMenuClose}>Eliminar</MenuItem>
                        </Menu>
                      </Box>
                    </>
                  )}
                </Box>
              ))
            ) : (
              <Typography sx={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
                No games found.
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
