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
import { useNavigate } from 'react-router-dom';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlist, loading, error } = useSelector((state) => state.wishlist);
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for forward, -1 for reverse
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Redirect if not authenticated or if the user is a company
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (userRole === 'empresa') {
      navigate('/');
    }
  }, [isAuthenticated, userRole, navigate]);

  // Fetch wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  // Filter unique items
  const uniqueWishlist = Array.from(new Map(wishlist.map((game) => [game._id, game])).values());
  const filteredWishlist = uniqueWishlist.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSearching = searchTerm.trim().length > 0;
  const isCarouselNeeded = filteredWishlist.length > 5; // Carousel only needed if there are more than 5 items

  // Auto-scroll functionality for back-and-forth carousel if needed
  useEffect(() => {
    if (!isSearching && isCarouselNeeded && !isDragging) {
      const scrollInterval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += scrollDirection;

          const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

          // Only reverse direction if more than 5 items
          if (scrollRef.current.scrollLeft >= maxScrollLeft || scrollRef.current.scrollLeft <= 0) {
            setScrollDirection((prevDirection) => prevDirection * -1);
          }
        }
      }, 20);

      return () => clearInterval(scrollInterval);
    }
  }, [isSearching, isCarouselNeeded, scrollDirection, isDragging]);

  // Handle drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle drag move
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Multiply by 1 for natural drag speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

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
            placeholder="Search games"
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
          <Typography>Loading wishlist...</Typography>
        ) : error ? (
          <Typography color="error">{typeof error === 'string' ? error : error.message}</Typography>
        ) : (
          <Box
            ref={scrollRef}
            sx={{
              display: 'flex',
              overflowX: isCarouselNeeded ? 'hidden' : 'auto',
              gap: '1rem',
              width: '100%',
              paddingBottom: '1rem',
              justifyContent: isCarouselNeeded ? 'flex-start' : 'center', // Center items if no carousel
              flexWrap: isCarouselNeeded ? 'nowrap' : 'wrap', // Wrap items if centered
              position: 'relative',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
          >
            {filteredWishlist.map((game) => (
              <Card
                key={game._id}
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dragging
                      dispatch(addToCart({ gameId: game._id, quantity: 1 }));
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent dragging
                      dispatch(removeFromWishlist({ gameId: game._id }));
                    }}
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
