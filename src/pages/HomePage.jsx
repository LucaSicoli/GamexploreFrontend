// Homepage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Container, Grid, Card, CardMedia, CardContent, Typography, Box,
  Checkbox, FormControlLabel, Slider, Radio, RadioGroup, TextField, InputAdornment,
  IconButton, Drawer
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import StarBorderIcon from '@mui/icons-material/StarBorder'

const Homepage = () => {
  const [games, setGames] = useState([]);
  const [page] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    maxPrice: 100,
    search: '',
    players: '',
    rating: '',
    language: ''
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
    if (filters.maxPrice >= 0) params.append('maxPrice', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);
    if (filters.language) params.append('language', filters.language);
    if (filters.players) params.append('players', filters.players);
    if (filters.rating) params.append('rating', filters.rating);
    params.append('isPublished', 'true'); // Filtra solo juegos publicados
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
      setError('Error loading games.');
      setLoading(false);
    }
  }, [buildQueryParams, token]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames, page]);

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
    setFilters((prevFilters) => ({ ...prevFilters, maxPrice: newValue === 0 ? 0 : newValue }));
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
            gap: '0.5rem',
          }}
        >
          <Typography sx={{ color: 'white' }}>Filtrar</Typography>
          <IconButton onClick={toggleDrawer(true)} sx={{ color: 'white' }}>
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '90%', md: '75%' },
          height: '3px',
          backgroundColor: 'grey',
          marginBottom: '1.5rem',
          marginLeft: { xs: '0', md: '19%' },
          marginTop: '-17px',
          alignSelf: 'center',
        }}
      />

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
            height: '1100px',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* Filtros en la vista de escritorio */}
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
              marginTop: '1rem',
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '1rem',
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
                color: 'white',
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            <Typography variant="subtitle2">Calificación</Typography>
            <Rating
              name="rating"
              value={filters.rating}
              onChange={(event, newValue) => setFilters((prevFilters) => ({ ...prevFilters, rating: newValue }))}
              precision={0.5}
              sx={{
                color: '#ffc107', // Color de las estrellas seleccionadas
              }}
              emptyIcon={<StarBorderIcon style={{ color: 'white' }} />} // Borde blanco para estrellas no seleccionadas
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <Typography variant="subtitle2">Sistema Operativo</Typography>
            <RadioGroup name="platform" onChange={handleFilterChange}>
              {['Windows', 'Mac', 'Linux'].map((platform) => (
                <FormControlLabel key={platform} control={<Radio />} label={platform} value={platform} />
              ))}
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <Typography variant="subtitle2">Idioma</Typography>
            {['Inglés', 'Español', 'Francés', 'Alemán'].map((language) => (
              <FormControlLabel
                key={language}
                control={<Checkbox name="language" value={language} onChange={handleFilterChange} />}
                label={language}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <Typography variant="subtitle2">Cantidad de Jugadores</Typography>
            {['Single-player', 'Multi-player'].map((players) => (
              <FormControlLabel
                key={players}
                control={<Checkbox name="players" value={players} onChange={handleFilterChange} />}
                label={players}
              />
            ))}
          </Box>

        </Box>

        <Container sx={{ maxWidth: '85%' }}>
          {loading ? (
            <Typography color="white">Cargando juegos...</Typography>
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
        </Container>
      </Box>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            backgroundColor: '#1e1e1e',
            color: 'white',
            width: 250,
            padding: '1rem',
            paddingBottom: '2rem',
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
                    sx={{ color: 'white' }}
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
                color: 'white',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="subtitle2">Sistema Operativo</Typography>
            <RadioGroup name="platform" onChange={handleFilterChange}>
              {['Windows', 'Mac', 'Linux'].map((platform) => (
                <FormControlLabel
                  key={platform}
                  control={<Radio value={platform} sx={{ color: 'white' }} />}
                  label={platform}
                />
              ))}
            </RadioGroup>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="subtitle2">Idioma</Typography>
            {['Inglés', 'Español', 'Francés', 'Alemán'].map((language) => (
              <FormControlLabel
                key={language}
                control={<Checkbox name="language" value={language} onChange={handleFilterChange} />}
                label={language}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Typography variant="subtitle2">Cantidad de Jugadores</Typography>
            {['Single-player', 'Multi-player'].map((players) => (
              <FormControlLabel
                key={players}
                control={<Checkbox name="players" value={players} onChange={handleFilterChange} />}
                label={players}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <Typography variant="subtitle2">Calificación</Typography>
            <Rating
              name="rating"
              value={filters.rating}
              onChange={(event, newValue) => setFilters((prevFilters) => ({ ...prevFilters, rating: newValue }))}
              precision={0.5}
              sx={{
                color: '#ffc107', // Color de las estrellas seleccionadas
              }}
              emptyIcon={<StarBorderIcon style={{ color: 'white' }} />} // Borde blanco para estrellas no seleccionadas
            />
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default Homepage;
