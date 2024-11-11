// Homepage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, Box, Pagination, 
  Checkbox, FormControlLabel, Slider, Radio, RadioGroup, TextField, InputAdornment, 
  IconButton, Drawer, Dialog, DialogContent, DialogActions, Button, Alert , Backdrop, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogSeverity, setDialogSeverity] = useState('success');


  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    maxPrice: 100,
    search: '',
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.platform) params.append('platform', filters.platform);
    
    // Enviar maxPrice solo si es mayor o igual a 0
    if (filters.maxPrice >= 0) {
      params.append('maxPrice', filters.maxPrice);
    }
    
    if (filters.search) params.append('search', filters.search);
    return params.toString();
  }, [filters]);

  const handleSearchChange = (e) => {
    setFilters((prevFilters) => ({ ...prevFilters, search: e.target.value }));
  };

  const fetchGames = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams();
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/games/filter?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGames(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading games:', error);
      setDialogMessage('Error al cargar los juegos.');
      setDialogSeverity('error');
      setDialogOpen(true);
      setLoading(false);
    }
  }, [buildQueryParams, token]);


  useEffect(() => {
    fetchGames();
  }, [fetchGames, page]);


  useEffect(() => {
    setOpenBackdrop(loading);
  }, [loading]);



  const handleCloseDialog = () => {
    setDialogOpen(false);
  };


  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? (checked ? value : '') : value,
    }));
  };

  const handleCardClick = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const handlePriceChange = (e, newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, maxPrice: newValue }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(0deg, #062A56 0%, #03152B 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: { xs: '1rem', md: '1.5rem' },
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontFamily: 'Orbitron',
            marginLeft: { md: '20rem' },
            marginTop: { xs: '0.5rem', md: '1rem' },
            marginBottom: { xs: '0.5rem' },
          }}
        >
          Games
        </Typography>

        <TextField
          placeholder="Buscar juego"
          variant="outlined"
          size="small"
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            backgroundColor: 'white',
            borderRadius: '5px',
            width: { xs: '100%', sm: '400px' },
            marginRight: { md: '2rem' },
            marginTop: { xs: '0.5rem', md: '1rem' },
          }}
        />

        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            marginTop: '1rem',
            gap: '0.5rem', // Espacio entre el texto y el icono
          }}
        >
          <Typography sx={{ color: 'white' }}>Filtrar</Typography>
          <IconButton onClick={toggleDrawer(true)} sx={{ color: 'white' }}>
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      {/* linea divisoria blanca */}
      <Box
        sx={{
          width: { xs: '90%', md: '82%' },
          height: '3px',
          backgroundColor: 'grey',
          marginBottom: '1.5rem',
          marginLeft: { xs: '0', md: '13%' },
          alignSelf: 'center',
        }}
      />

      {/* sidebar */}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '5px' }}>
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: '220px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '1rem',
            marginLeft: '2rem',
            color: 'white',
            border: '2px solid grey',
            height: '620px',
            flexDirection: 'column',
            gap: '2rem', // Más espacio entre las secciones principales
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="subtitle2">Categoría</Typography>
            {['Aventura', 'Acción', 'RPG', 'MOBA', 'FPS', 'Estrategia', 'Free To Play'].map((category) => (
              <FormControlLabel
                key={category}
                control={<Checkbox name="category" value={category} onChange={handleFilterChange} />}
                label={category}
              />
            ))}
          </Box>

          <Box
            sx={{
              marginTop: '1rem', // Espacio adicional entre las secciones
              display: 'flex',
              flexDirection: 'column',  // Menor espacio entre el título y la barra
              marginBottom: '1rem', // Espacio inferior entre esta sección y la siguiente
            }}
          >
            <Typography variant="subtitle2">Precio Máximo</Typography>
            <Slider
              value={filters.maxPrice}
              onChange={handlePriceChange}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => (value === 0 ? "Free" : `$${value}`)}
              sx={{
                color: 'white', // Color blanco para el Slider
              }}
            />

          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginTop: '1rem', // Espacio adicional entre las secciones
            }}
          >
            <Typography variant="subtitle2">Sistema Operativo</Typography>
            <RadioGroup name="platform" onChange={handleFilterChange}>
              {['Windows', 'Mac', 'Linux'].map((platform) => (
                <FormControlLabel key={platform} control={<Radio />} label={platform} value={platform} />
              ))}
            </RadioGroup>
          </Box>
        </Box>

        {/* Contenedor de juegos */}
        <Container sx={{ maxWidth: '85%', flex: 1 }}>
          {loading ? (
            <Backdrop
              sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
              open={openBackdrop}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <Grid container spacing={3}>
              {games.map((game) => (
                <Grid item xs={12} sm={6} md={4} key={game._id}>
                  <Card
                    sx={{
                      maxWidth: '350px',
                      margin: 'auto',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleCardClick(game._id)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={game.imageUrl}
                      alt={game.name}
                      sx={{ borderRadius: '8px 8px 0 0' }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="body1" sx={{ color: 'white' }}>
                        {game.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#d1d1d1' }}>
                        {game.category}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#00e676' }}>
                        {game.price === 0 ? 'Gratis' : `$${game.price}`}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            {games.length > 0 && (
              <Pagination
              count={22}
              page={page}
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: 'white', // Cambia el color del texto a blanco
                },
                '& .Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Fondo transparente para el item seleccionado
                  color: 'white', // Color del número seleccionado
                },
                '& .MuiPaginationItem-root:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo al pasar el cursor
                },
              }}
            />
            )}
            
          </Box>
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#1e1e1e', // Fondo oscuro para el Drawer
            color: 'white', // Color blanco para el texto
            width: 250, // Ancho del Drawer
            padding: '1rem',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Typography variant="h6">Filtros</Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="subtitle2">Categoría</Typography>
            {['Aventura', 'Acción', 'RPG', 'MOBA'].map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    name="category"
                    value={category}
                    onChange={handleFilterChange}
                    sx={{ color: 'white' }} // Checkbox blanco
                  />
                }
                label={category}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="subtitle2">Precio Máximo</Typography>
            <Slider
              value={filters.maxPrice}
              onChange={handlePriceChange}
              min={0}
              max={100}
              valueLabelDisplay="auto"
              sx={{
                color: 'white', // Color blanco para el Slider
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="subtitle2">Sistema Operativo</Typography>
            <RadioGroup name="platform" onChange={handleFilterChange}>
              {['Windows', 'Mac', 'Linux'].map((platform) => (
                <FormControlLabel
                  key={platform}
                  control={
                    <Radio
                      value={platform}
                      sx={{ color: 'white' }} // Radio Button blanco
                    />
                  }
                  label={platform}
                />
              ))}
            </RadioGroup>
          </Box>
        </Box>
      </Drawer>
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
  
        <DialogContent>
          <Alert severity={dialogSeverity} sx={{ mb: 2 }}>
            <Typography variant="body1">{dialogMessage}</Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default Homepage;
