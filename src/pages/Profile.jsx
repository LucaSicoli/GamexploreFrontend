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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { fetchUserGames } from '../redux/userSlice';
import {togglePublishGame, deleteGame } from '../redux/gameSlice';
import Navbar from '../components/Navbar';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Inicializar navigate
  const { games, loading, error } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGameId, setSelectedGameId] = useState(null); // Para almacenar el ID del juego seleccionado
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)'); // Detecta si es mobile

  useEffect(() => {
    dispatch(fetchUserGames());
  }, [dispatch]);

  const handleMenuClick = (event, gameId) => {
    setAnchorEl(event.currentTarget);
    setSelectedGameId(gameId); // Establecer el ID del juego seleccionado
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGameId(null); // Limpiar el ID del juego seleccionado
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };


  const handleEditGame = () => {
    navigate(`/edit-game/${selectedGameId}`); // Redirigir a la página de edición
    handleMenuClose(); // Cerrar el menú
  };

  const handleTogglePublish = () => {
    dispatch(togglePublishGame(selectedGameId)); // Cambiar el estado de publicación
    handleMenuClose(); // Cerrar el menú
  };

  const handleDialogClose = () => {
    setOpenDialog(false); // Cerrar el diálogo sin eliminar
  };

  const confirmDelete = () => {
    setOpenDialog(true); // Abre el diálogo de confirmación
  };


  const handleDeleteGame = () => {

    dispatch(deleteGame(selectedGameId)); // Eliminar el juego
    handleMenuClose(); // Cerrar el menú
    handleDialogClose();
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
                        {/* Círculo de estado */}
                        <span style={{
                          width:"10px",
                          height:"10px",
                          borderRadius:"50%",
                          backgroundColor: game.isPublished ? "green" : "red",
                          display:"inline-block",
                          marginLeft:"8px"
                        }} />
                      </Typography>
                      <Typography variant="body2" color="white" textAlign="center">
                        {game.isPublished ? `Publicado` : `Despublicado`} el {game.publishedDate || `N/A`}
                      </Typography>
                      <Box display="flex" justifyContent="center" alignItems="center" gap="0.5rem" mt={0.5}>
                        <Rating value={game.rating || 0} readOnly precision={0.1} />
                        <Typography variant="body2">
                          {game.rating?.toFixed(1) || `0`} ({game.ratingCount || `0`} reseñas)
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-around" width="100%" mt={1}>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <VisibilityIcon fontSize="small" />
                          <Typography variant="body2">{game.views || `0`}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <FavoriteIcon fontSize="small" />
                          <Typography variant="body2">{game.wishlistCount || `0`}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <ShoppingCartIcon fontSize="small" />
                          <Typography variant="body2">{game.purchases || `0`}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap="0.3rem">
                          <TrendingUpIcon fontSize="small" />
                          {/* Cálculo correcto de la tasa de conversión */}
                          <Typography variant="body2">
                            {(game.purchases && game.views) 
                              ? `${((game.purchases / game.views) * 100).toFixed(2)}%`
                              : `N/A`}
                          </Typography>
                        </Box>
                      </Box>
                      {/* Menú de opciones */}
                      <Box display="flex" justifyContent="center" mt={1}>
                        <IconButton
                          aria-label="more"
                          onClick={(event) => handleMenuClick(event, game._id)}
                          sx={{ color:`white` }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                          {/* Opciones del menú */}
                          <MenuItem onClick={handleEditGame}>Edit</MenuItem>
                          {/* Cambiar texto según estado de publicación */}
                          <MenuItem onClick={handleTogglePublish}>
                            {game.isPublished ? `Despublicar` : `Publicar`}
                          </MenuItem>
                          <MenuItem onClick={handleDeleteGame}>Eliminar</MenuItem>
                        </Menu>
                      </Box>
                    </>
                  ) : (
                    // Contenido en escritorio
                    <>
                      {/* Información del juego */}
                      <Box display={`flex`} alignItems={`center`} gap={`1.5rem`} flexWrap={`wrap`}>
                        <Box>
                          <Typography variant={`h6`} sx={{ fontWeight:`bold`, fontSize:`1.2rem` }}>
                            {game.name}
                            {/* Círculo de estado */}
                            <span style={{
                              width:"10px",
                              height:"10px",
                              borderRadius:"50%",
                              backgroundColor: game.isPublished ? "green" : "red",
                              display:"inline-block",
                              marginLeft:"8px"
                            }} />
                          </Typography>
                          <Typography variant={`body2`} color={`white`}>
                            {game.isPublished ? `Publicado` : `Despublicado`} el {game.publishedDate || `N/A`}
                          </Typography>
                          <Box display={`flex`} alignItems={`center`} gap={`0.5rem`} mt={0.5}>
                            <Rating value={game.rating || `0`} readOnly precision={`0.1`} />
                            <Typography variant={`body2`}>
                              {game.rating?.toFixed(1) || `0`} ({game.ratingCount || `0`} reseñas)
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Información adicional */}
                      <Box display={`flex`} alignItems={`center`} gap={`2rem`} flexWrap={`wrap`}>
                        {/* Visualizaciones */}
                        <Box display={`flex`} alignItems={`center`} gap={`0.3rem`}>
                          <VisibilityIcon fontSize={`small`} />
                          <Typography variant={`body2`}>{game.views || `0`}</Typography>
                        </Box>

                        {/* Wishlist Count */}
                        <Box display={`flex`} alignItems={`center`} gap={`0.3rem`}>
                          <FavoriteIcon fontSize={`small`} />
                          <Typography variant={`body2`}>{game.wishlistCount || `0`}</Typography>
                        </Box>

                        {/* Purchases Count */}
                        <Box display={`flex`} alignItems={`center`} gap={`0.3rem`}>
                          <ShoppingCartIcon fontSize={`small`} />
                          <Typography variant={`body2`}>{game.purchases || `0`}</Typography>
                        </Box>

                        {/* Tasa de conversión */}
                        <Box display={`flex`} alignItems={`center`} gap={`0.3rem`}>
                          <TrendingUpIcon fontSize={`small`} />
                          {/* Cálculo correcto de la tasa de conversión */}
                          <Typography variant={`body2`}>
                            {(game.purchases && game.views) 
                              ? `${((game.purchases / game.views) * 100).toFixed(2)}%`
                              : `N/A`}
                          </Typography>
                        </Box>

                      </Box>

                      {/* Menú de opciones */}
                      <IconButton
                        aria-label={`more`}
                        onClick={(event) => handleMenuClick(event, game._id)}
                        sx={{ color:`white` }}
                      >
                        <MoreVertIcon />
                      </IconButton>

                      {/* Opciones del menú */}
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {/* Aquí puedes agregar las opciones del menú */}
                        <MenuItem onClick={handleEditGame}>Edit</MenuItem>
                        {/* Cambiar texto según estado de publicación */}
                        <MenuItem onClick={handleTogglePublish}>
                            {game.isPublished ? `Despublicar` : `Publicar`}
                        </MenuItem>

                        {/* Opción para eliminar el juego */}
                        <MenuItem onClick={confirmDelete}>Eliminar</MenuItem>
                      </Menu>

                    </>
                  )}
                </Box>
              ))
            ) : (
              // Mensaje si no hay juegos encontrados
              <Typography sx={{ color:`white`, textAlign:`center`, marginTop:`2rem` }}>
                No games found.
              </Typography>
            )}
          </Box>
        </Box>
        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
        >
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas eliminar este juego? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteGame} color="secondary" autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default Profile;
