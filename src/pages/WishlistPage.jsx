import React, { useEffect, useState, useRef } from 'react';
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';
import Navbar from '../components/Navbar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items);
  const loading = useSelector((state) => state.wishlist.loading);
  const error = useSelector((state) => state.wishlist.error);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (!searchTerm) {
      const scrollInterval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += 1;

          const maxScrollLeft = scrollRef.current.scrollWidth / 2;

          if (scrollRef.current.scrollLeft >= maxScrollLeft) {
            scrollRef.current.scrollLeft = 0;
          }
        }
      }, 20);

      return () => clearInterval(scrollInterval);
    }
  }, [searchTerm]);

  const handleRemoveFromWishlist = async (gameId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Usuario no autenticado. Por favor, inicie sesión.");
      return;
    }
    dispatch(removeFromWishlist({ gameId }));
  };

  const handleAddToCart = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("User is not authenticated.");
        return;
      }

      const resultAction = await dispatch(addToCart({ gameId, quantity: 1 }));
      if (addToCart.fulfilled.match(resultAction)) {
    
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add game to cart.");
    }
  };

  const filteredWishlist = wishlist.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSearching = searchTerm.trim().length > 0;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(180deg, #0a2a55 0%, #03152B 100%)',
          minHeight: '100vh',
          padding: '3rem 1rem',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowX: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            justifyContent: { xs: 'center', md: 'space-between' },
            flexDirection: { xs: 'column', md: 'row' },
            width: '100%',
            maxWidth: '1000px',
            gap: { xs: 2, md: 5 },
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontFamily: 'Orbitron, sans-serif',
              textAlign: { xs: 'center', md: 'left' },
              fontSize: '2.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            Wishlist <FavoriteIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
          </Typography>

          <TextField
            placeholder="Buscar juego"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: 'white' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: { xs: '100%', md: '400px' },
              backgroundColor: '#10345b',
              borderRadius: '10px',
              input: { color: 'white' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: '#4CAF50',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#4CAF50',
                },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            width: '80%',
            height: '2px',
            backgroundColor: '#ffffff55',
            marginBottom: '2rem',
            marginX: 'auto',
          }}
        />

        {loading ? (
          <Typography>Cargando wishlist...</Typography>
        ) : error ? (
          <Typography color="error">{typeof error === 'string' ? error : error.message}</Typography>
        ) : (
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: 'hidden',
              gap: '1rem',
              width: '100%',
              paddingBottom: '1rem',
              justifyContent: isSearching ? 'center' : 'flex-start',
              flexWrap: isSearching ? 'wrap' : 'nowrap',
            }}
          >
            {(isSearching ? filteredWishlist : [...filteredWishlist, ...filteredWishlist]).map((game, index) => (
              <Card
                key={`${game._id}-${index}`}
                sx={{
                  backgroundColor: '#1A2B46',
                  borderRadius: '15px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                  width: '250px',
                  flex: '0 0 auto',
                  padding: '1rem',
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                <CardMedia
                  component="img"
                  image={game.imageUrl || 'https://via.placeholder.com/100'}
                  alt={game.name}
                  sx={{
                    width: '100%',
                    height: '180px',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    objectFit: 'cover',
                  }}
                />
                <CardContent sx={{ padding: 0, textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {game.name}
                  </Typography>
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <IconButton
                    onClick={() => handleAddToCart(game._id)}
                    sx={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#1565c0',
                      },
                      width: '36px',
                      height: '36px',
                    }}
                  >
                    <ShoppingCartIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    onClick={() => handleRemoveFromWishlist(game._id)}
                    sx={{
                      backgroundColor: '#d32f2f',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#c62828',
                      },
                      width: '36px',
                      height: '36px',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default WishlistPage;
