import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, increaseCartQuantity, removeFromCart, decreaseCartQuantity, clearCart } from '../redux/cartSlice';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  useMediaQuery,
} from '@mui/material';
import { Add, Remove, Delete as DeleteIcon, ShoppingCartOutlined as ShoppingCartOutlinedIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const truncateName = (name) => {
  return name.length > 10 ? `${name.slice(0, 10)}...` : name;
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state) => state.cart);
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect based on authentication and role, or fetch cart if gamer
    if (!isAuthenticated) {
      navigate('/login');
    } else if (userRole === 'empresa') {
      navigate('/');
    } else if (userRole === 'gamer') {
      // Fetch cart data only if user is a gamer and authenticated
      dispatch(fetchCart());
    }
  }, [isAuthenticated, userRole, navigate, dispatch]);

  const isMobile = useMediaQuery('(max-width:600px)');

  const handleIncreaseQuantity = (gameId) => {
    dispatch(increaseCartQuantity(gameId));
  };

  const handleDecreaseQuantity = (gameId) => {
    dispatch(decreaseCartQuantity(gameId));
  };

  const handleRemoveItem = (gameId) => {
    dispatch(removeFromCart(gameId));
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ padding: { xs: '1rem', md: '2rem' }, backgroundColor: '#041C32', minHeight: '100vh' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'white',
            fontFamily: 'Orbitron',
            fontSize: { xs: '1.5rem', md: '2rem' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Typography component="span" sx={{ fontSize: { xs: '1.25rem', md: '2rem' }, marginRight: '0.5rem', fontFamily: 'Orbitron' }}>
              Shopping Cart
            </Typography>
            <ShoppingCartOutlinedIcon sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, color: 'white' }} />
          </Box>
        </Typography>
        <Divider sx={{ backgroundColor: 'white', margin: { xs: '0.5rem 0', md: '1rem 0' } }} />

        {items.length === 0 ? (
          <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>
            Your cart is empty.
          </Typography>
        ) : (
          <Box sx={{ display: { xs: 'block', md: 'flex' }, gap: { md: '2rem' }, justifyContent: { md: 'space-between' } }}>
            <Box flex={3} sx={{ paddingRight: { md: '1rem' } }}>
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', overflow: 'visible', paddingBottom: '0' }}>
                <Table sx={{ width: '100%' }}>
                  <TableBody>
                    {items.map((item, index) => (
                      <TableRow
                        key={item.gameId}
                        sx={{
                          backgroundColor: '#062A56',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: { xs: '0.5rem', md: '1rem' },
                          gap: '1rem',
                          width: 'calc(100% - 1rem)',
                          mb: index === items.length - 1 ? 0 : 1,
                          overflow: 'visible',
                          marginRight: { md: '1rem' },
                        }}
                      >
                        {/* Game Image */}
                        <TableCell sx={{ borderBottom: 'none', padding: 0, width: { xs: '60px', md: '80px' } }}>
                          <Box
                            sx={{
                              width: { xs: '60px', md: '80px' },
                              height: { xs: '60px', md: '80px' },
                              overflow: 'hidden',
                              borderRadius: '10px',
                              margin: 'auto',
                            }}
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
                            />
                          </Box>
                        </TableCell>

                        {/* Game Name, Price, Quantity Controls, and Trash Icon */}
                        <TableCell
                          sx={{
                            borderBottom: 'none',
                            color: 'white',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.5rem',
                            flex: 1,
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            marginRight: { md: '1rem' },
                          }}
                        >
                          {/* Name and Price */}
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, textAlign: 'left' }}>
                              {isMobile ? truncateName(item.name) : item.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: '#00e676',
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', md: '1rem' },
                              }}
                            >
                              {item.price === 0 ? 'Free' : `$${item.price * item.quantity}`}
                            </Typography>
                          </Box>

                          {/* Quantity Controls and Trash Icon at the End */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <IconButton onClick={() => handleDecreaseQuantity(item.gameId)} color="primary" size="small">
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography sx={{ fontWeight: 'bold', color: 'white', fontSize: { xs: '0.9rem', md: '1rem' } }}>
                              {item.quantity}
                            </Typography>
                            <IconButton onClick={() => handleIncreaseQuantity(item.gameId)} color="primary" size="small">
                              <Add fontSize="small" />
                            </IconButton>
                            <IconButton onClick={() => handleRemoveItem(item.gameId)} color="secondary" size="small" sx={{ marginLeft: '0.5rem' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Order Summary Box with Fixed Height and Clear Cart Button Style */}
            <Box
              flex={1}
              sx={{
                padding: '1rem',
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                marginTop: { xs: '1rem', md: '0' },
                height: '260px', // Fixed height for desktop
                overflowY: 'auto', // Scroll if content exceeds height
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                Order Summary
              </Typography>
              <Box sx={{ marginTop: '1rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Typography>Subtotal</Typography>
                  <Typography>{totalPrice === 0 ? 'Free' : `$${totalPrice.toFixed(2)}`}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <Typography>Tax</Typography>
                  <Typography>$2.00</Typography>
                </Box>
                <Divider sx={{ marginY: '0.5rem' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: 'bold' }}>
                  <Typography>Total</Typography>
                  <Typography>{totalPrice + 2 === 2 ? 'Free' : `$${(totalPrice + 2).toFixed(2)}`}</Typography>
                </Box>
                <Button variant="contained" color="primary" fullWidth sx={{ marginBottom: '1rem' }} onClick={() => navigate('/checkout')}>
                  Continue to Payment
                </Button>
                <Button variant="contained" fullWidth sx={{ backgroundColor: 'red', color: 'white' }} onClick={handleClearCart}>
                  Clear Cart
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};

export default CartPage;
