// src/pages/GameDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Rating,
  Grid,
  TextField,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import Avatar from '@mui/material/Avatar';
import Navbar from '../components/Navbar';
import { addToWishlist } from '../redux/wishlistSlice';
import { addToCart } from '../redux/cartSlice';


const GameDetails = () => {
  const { gameId } = useParams();
  const dispatch = useDispatch();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(9);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/games/${gameId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setGame(response.data);
        setComments(response.data.comments || []);
      } catch (err) {
        setError('Error al cargar los detalles del juego');
      }
    };
    fetchGameDetails();
  }, [gameId]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("User is not authenticated.");
        return;
      }
  
      // Dispatch the addToCart action with gameId and quantity
      dispatch(addToCart({ gameId: game._id, quantity: 1 }));
     
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add game to cart.");
    }
  };
  
  

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Usuario no autenticado.");
        return;
      }
  
      const resultAction = await dispatch(addToWishlist({ gameName: game.name }));
      if (addToWishlist.fulfilled.match(resultAction)) {
        alert(resultAction.payload.message);
      }
    } catch (err) {
      console.error("Error al añadir a la wishlist:", err);
      alert("No se pudo agregar a la wishlist.");
    }
  };
  
  
  

  const handleAddComment = async () => {
    if (!newComment.trim() || !newRating) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Usuario no autenticado.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/comments/${gameId}/comment`,
        { text: newComment, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCommentData = response.data.comment;
      setComments((prevComments) => [newCommentData, ...prevComments]);

      const updatedGameResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/games/${gameId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGame(updatedGameResponse.data);

      setNewComment('');
      setNewRating(0);
    } catch (err) {
      console.error("Error al agregar el comentario:", err);
      setError('No se pudo agregar el comentario.');
    }
  };

  const handleLoadMoreComments = () => {
    setVisibleCommentsCount((prevCount) => prevCount + 9);
  };

  const handleShowLessComments = () => {
    setVisibleCommentsCount(9);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!game) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          background: 'linear-gradient(0deg, #062A56 0%, #03152B 100%)',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem 0',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              backgroundColor: 'rgba(202, 202, 202, 0.12)',
              padding: '2rem',
              borderRadius: '10px',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h3" sx={{ fontFamily: 'Orbitron, sans-serif' }}>
                {game.name}
              </Typography>
              <Typography 
                variant="h3" 
                color="#00e676" 
                sx={{ 
                  ml: { xs: 2, md: 0 },
                  mr: { md: '2rem' }    
                }}
              >
                {game.price === 0 ? 'Gratis' : `$${game.price}`}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} mb={2}>
              <Box display="flex" alignItems="center">
                <Rating
                  value={game.rating || 0}
                  precision={0.5}
                  readOnly
                  icon={<StarIcon fontSize="inherit" />}
                />
                <Typography variant="body2" ml={1}>
                  {game.rating ? game.rating.toFixed(1) : '0'} ({game.ratingCount || 0} reseñas)
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={2} mt={2} mb={2}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
              >
                Añadir al carrito
              </Button>
              <Button variant="contained" color="secondary" startIcon={<FavoriteIcon />} onClick={handleAddToWishlist}>
                Favorito
              </Button>

            </Box>

            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '10px',
                mb: 2,
              }}
            >
              <CardMedia
                component="img"
                image={game.imageUrl}
                alt={game.name}
                sx={{ width: '100%', maxHeight: 300, borderRadius: '10px' }}
              />
            </Card>

            <Box display="flex" flexWrap="wrap" gap={1} mt={2} mb={2}>
              {game.category?.split(', ').map((tag) => (
                <Chip key={tag} label={tag} color="primary" variant="outlined" />
              ))}
            </Box>

            <Typography variant="body1" paragraph>
              {game.description}
            </Typography>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Requerimientos del sistema
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Hardware</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Mínimos</TableCell>
                      <TableCell align="center" sx={{ color: 'white', fontWeight: 'bold' }}>Recomendados</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ color: 'white' }}>CPU</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.minimum?.cpu || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.recommended?.cpu || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ color: 'white' }}>GPU</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.minimum?.gpu || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.recommended?.gpu || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ color: 'white' }}>RAM</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.minimum?.ram || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.recommended?.ram || 'N/A'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" sx={{ color: 'white' }}>DISK</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.minimum?.storage || 'N/A'}</TableCell>
                      <TableCell align="center" sx={{ color: 'white' }}>{game.systemRequirements?.recommended?.storage || 'N/A'}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Sobre la empresa desarrolladora
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                {game.developer?.logo && (
                  <Avatar src={game.developer.logo} alt={game.developer.name} sx={{ width: 64, height: 64 }} />
                )}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {game.developer?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    {game.developer?.description || 'No hay descripción disponible.'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom>
                Reseñas de la comunidad
              </Typography>
              <Grid container spacing={2}>
                {comments.slice(0, visibleCommentsCount).map((comment, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Box display="flex" alignItems="center" gap={2} border={1} borderRadius={2} p={2} borderColor="grey.500">
                      <Avatar src={comment.user?.logo} alt={comment.user?.name} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comment.user?.name || 'Usuario Anónimo'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Fecha no disponible'}
                        </Typography>
                        <Rating value={comment.rating || 0} readOnly size="small" />
                        <Typography variant="body2">{comment.text}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <Box display="flex" justifyContent="center" mt={2} gap={2}>
                {visibleCommentsCount < comments.length && (
                  <Button variant="contained" color="primary" onClick={handleLoadMoreComments}>
                    Cargar más
                  </Button>
                )}
                {visibleCommentsCount > 9 && (
                  <Button variant="contained" color="secondary" onClick={handleShowLessComments}>
                    Mostrar menos
                  </Button>
                )}
              </Box>
            </Box>

            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Agregar un comentario
              </Typography>
              <TextField
                label="Escribe tu comentario y puntúa el juego"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{
                  mt: 2,
                  backgroundColor: 'transparent',
                  borderRadius: '5px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#FFFFFF',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4CAF50',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4CAF50',
                    },
                  },
                  color: 'white',
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              <Box mt={2} marginTop={1}>
                <Rating
                  name="rating"
                  value={newRating}
                  onChange={(event, newValue) => setNewRating(newValue)}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddComment}
                sx={{ mt: 2 }}
              >
                Agregar comentario
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default GameDetails;
