import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Avatar, IconButton, Menu, MenuItem, Drawer, Stack,
  TextField, InputAdornment 
} from '@mui/material';
import { MoreVert, Search as SearchIcon, FilterList as FilterListIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FilterComponent from '../components/Filter';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const mockGamesData = [
    {
        id: 1,
        title: "FIFA 16",
        publicationDate: "18/03/2015",
        rating: 4.07,
        reviews: 709,
        views: 12990,
        wishlist: 2100,
        purchases: 3440,
        conversionRate: "25.71%",
        status: "Publicado",
    },
    {
        id: 2,
        title: "FIFA 17",
        publicationDate: "01/09/2022",
        rating: 4.22,
        reviews: 838,
        views: 11754,
        wishlist: 1099,
        purchases: 809,
        conversionRate: "14.52%",
        status: "Despublicado",
    },
    {
        id: 3,
        title: "FIFA 18",
        publicationDate: "04/09/2017",
        rating: 3.90,
        reviews: 1003,
        views: 24981,
        wishlist: 391,
        purchases: 8505,
        conversionRate: "22.75%",
        status: "Publicado",
    },
    {
        id: 4,
        title: "NBA2K20",
        publicationDate: "15/10/2019",
        rating: 4.44,
        reviews: 2328,
        views: 98761,
        wishlist: 5012,
        purchases: 12001,
        conversionRate: "12.19%",
        status: "Publicado",
    },
];

const ProfilePage = () => {
    const [games, setGames] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        platform: '',
        maxPrice: 100,
        search: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Simular llamada al backend para obtener los datos de los juegos
        setGames(mockGamesData);
    }, []);

    const handleMenuClick = (event, game) => {
        setAnchorEl(event.currentTarget);
        setSelectedGame(game);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedGame(null);
    };

    const handleSearchChange = (e) => {
        setFilters((prevFilters) => ({ ...prevFilters, search: e.target.value }));
    };

    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: type === 'checkbox' ? (checked ? value : '') : value,
        }));
    };

    const handlePriceChange = (e, newValue) => {
        setFilters((prevFilters) => ({ ...prevFilters, maxPrice: newValue }));
    };

    // Filtrar juegos según los filtros aplicados
    const filteredGames = games.filter((game) => {
        if (filters.category && filters.category !== game.category) return false;
        if (filters.platform && filters.platform !== game.platform) return false;
        if (filters.maxPrice && game.price > filters.maxPrice) return false;
        if (filters.search && !game.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        return true;
    });

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
                    Lista de juegos
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
                    width: { xs: '90%', md: '80%' },
                    height: '3px',
                    backgroundColor: 'grey',
                    marginBottom: '1.5rem',
                    marginLeft: { xs: '0', md: '15%' },
                    alignSelf: 'center',
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'flex-start',
                    gap: '2rem',
                    width: '97%',
                    padding: '1rem',
                    marginTop: '-17px',
                }}
            >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <FilterComponent filters={filters} onFilterChange={handleFilterChange} onPriceChange={handlePriceChange} />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Box>
                        {filteredGames.map((game) => (
                            <Card key={game.id} sx={{ display: 'flex', marginBottom: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                                    <Box>
                                        <Avatar
                                            variant="square"
                                            src={`/path/to/game/image/${game.id}.jpg`} // Imagen del juego
                                            alt={game.title}
                                            sx={{ width: 90, height: 128, margin: '1rem', borderRadius: '5px' }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="h4" sx={{fontWeight: 'bold'}}>{game.title}</Typography>
                                            <Typography variant="body2" color="gray">Publicado el {game.publicationDate}</Typography>
                                            <Typography variant="body1" sx={{ marginTop: '0.5rem' }}>
                                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: '20px' }}>
                                            <StarIcon sx={{ color: '#FFD700', fontSize: '2rem' }} /> {/* Estrella amarilla */}
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                                                {game.rating}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'gray', fontSize: '0.8rem', position: 'relative', top: '7px' }}>
                                                {game.reviews} reseñas
                                            </Typography>
                                            </Stack>
                                            </Typography>
                                        </CardContent>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '3rem', marginTop: '0.5rem' }}>
                                    <CardContent sx={{ flex: 1, justifyContent: 'space-between' }}>
                                        <Stack spacing={0.5}>
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                                <VisibilityIcon sx={{ mr: '8px' }} /> {/* Espacio entre icono y texto */}
                                                <Typography variant="body1" sx={{ marginRight: '4px', marginTop: '4px' }}>
                                                Visualizaciones: <strong>{game.views}</strong>
                                                </Typography>
                                            </Typography>

                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                                                <FavoriteIcon sx={{ mr: '8px' }} /> {/* Espacio entre icono y texto */}
                                                <Typography variant="body1" sx={{ marginRight: '4px', marginTop: '4px' }}>
                                                Wishlist: <strong>{game.wishlist}</strong>
                                                </Typography>
                                            </Typography>

                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                                                <ShoppingCartIcon sx={{ mr: '8px' }} /> {/* Espacio entre icono y texto */}
                                                <Typography variant="body1" sx={{ marginRight: '4px', marginTop: '4px' }}>
                                                Compras: <strong>{game.purchases}</strong>
                                                </Typography>
                                            </Typography>

                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mt: '4px' }}>
                                                <LeaderboardIcon sx={{ mr: '8px' }} /> {/* Espacio entre icono y texto */}
                                                <Typography variant="body1" sx={{ marginRight: '4px', marginTop: '4px' }}>
                                                Tasa de conversión: <strong>{game.conversionRate}</strong>
                                                </Typography>
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center', marginRight:'25px' }}>
                                    <IconButton onClick={(event) => handleMenuClick(event, game)} color="inherit">
                                        <MoreVert />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{
                                            style: {
                                                maxHeight: 200,
                                                width: '20ch',
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={() => navigate(`/edit/${selectedGame?.id}`)}>Editar</MenuItem>
                                        <MenuItem onClick={handleMenuClose}>Despublicar</MenuItem>
                                        <MenuItem onClick={handleMenuClose}>Eliminar</MenuItem>
                                    </Menu>
                                </Box>
                            </Card>
                        ))}
                    </Box>
                </Box>
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

export default ProfilePage;
