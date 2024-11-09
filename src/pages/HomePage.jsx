// Homepage.jsx
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { 
  Container, Grid, Card, CardMedia, CardContent, Typography, Box, Pagination, TextField, InputAdornment, 
  IconButton, Drawer 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Navbar from '../components/Navbar'; 
import FilterComponent from '../components/Filter';
import { useNavigate } from 'react-router-dom';

const Homepage = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado del Drawer
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: '',
    platform: '',
    maxPrice: 100,
    search: '',
  });

  const token = localStorage.getItem('token');

  // Construcción de parámetros de consulta para la API
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.platform) params.append('platform', filters.platform);
    if (filters.maxPrice >= 0) params.append('maxPrice', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);
    return params.toString();
  }, [filters]);

  // Función para obtener juegos filtrados
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
      console.error('Error al obtener los juegos:', error);
      setError('Error al cargar los juegos.');
      setLoading(false);
    }
  }, [buildQueryParams, token]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames, page]);

  // Control de cambios en filtros de categoría, plataforma, etc.
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? (checked ? value : '') : value,
    }));
  };

  // Control de búsqueda
  const handleSearchChange = (e) => {
    setFilters((prevFilters) => ({ ...prevFilters, search: e.target.value }));
  };

  // Lógica de cambio de precio
  const handlePriceChange = (e, newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, maxPrice: newValue }));
  };

  const handleCardClick = (gameId) => {
    navigate(`/game/${gameId}`);
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
            marginBottom: { xs: '0.5rem'},
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
          width: { xs: '90%', md: '82%' },
          height: '3px',
          backgroundColor: 'grey',
          marginBottom: '1.5rem',
          marginLeft: { xs: '0', md: '13%' },
          alignSelf: 'center',
        }}
      />



       <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'flex-start',
          gap: '2rem',
          width: '100%',
          padding: '1rem',
          marginTop: '-17px', // Reducción del margen superior
        }}
      >
        {/* Sidebar o Drawer para filtros */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <FilterComponent filters={filters} onFilterChange={handleFilterChange} onPriceChange={handlePriceChange} />
        </Box>

        {/* Contenedor de juegos */}
        <Container sx={{ maxWidth: '85%', flex: 1 }}>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Pagination
              count={22}
              page={page}
              onChange={handlePageChange}
              sx={{
                '& .MuiPaginationItem-root': { color: 'white' },
                '& .Mui-selected': { backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' },
                '& .MuiPaginationItem-root:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            />
          </Box>
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
          },
        }}
      >
        <FilterComponent filters={filters} onFilterChange={handleFilterChange} onPriceChange={handlePriceChange} />
      </Drawer>
    </div>
  );
};

export default Homepage;
