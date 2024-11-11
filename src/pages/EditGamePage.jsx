import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormGroup, Snackbar, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGameById, updateGame, clearError, clearSuccessMessage } from '../redux/gameSlice';
import Navbar from '../components/Navbar';

const EditGamePage = () => {
    const { gameId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { game, loading, error, successMessage } = useSelector((state) => state.game);
    
    const [gameData, setGameData] = useState({
        name: '',
        category: [],
        description: '',
        image: null,
        imagePreview: '',
        systemRequirements: {
            minimum: { cpu: '', gpu: '', ram: '', storage: '' },
            recommended: { cpu: '', gpu: '', ram: '', storage: '' }
        },
        price: '',
        players: 'Single-player',
        language: [],
        platform: [],
    });

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Cargar el juego al montar el componente
    useEffect(() => {
        dispatch(fetchGameById(gameId));
    }, [dispatch, gameId]);

    useEffect(() => {
        if (game) {
            setGameData({
                name: game.name,
                category: game.category ? game.category.split(',') : [],
                description: game.description,
                price: game.price,
                players: game.players || 'Single-player',
                language: game.language || [],
                platform: game.platform || [],
                systemRequirements: game.systemRequirements,
                imagePreview: game.imageUrl
            });
        }
    }, [game]);

    useEffect(() => {
        if (successMessage) {
            setSnackbarMessage('Cambios guardados exitosamente!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                dispatch(clearSuccessMessage());
                navigate('/home');
            }, 3000);
        }
    }, [successMessage, dispatch, navigate]);

    useEffect(() => {
        if (error) {
            setSnackbarMessage(error);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleInputChange = (e) => setGameData({ ...gameData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setGameData({ ...gameData, image: file });

            const reader = new FileReader();
            reader.onloadend = () => {
                setGameData((prevData) => ({ ...prevData, imagePreview: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePlatformChange = (event) => {
        const { value } = event.target;
        setGameData({
            ...gameData,
            platform: typeof value === 'string' ? value.split(',') : value,
        });
    };

    const handleCategoryChange = (event) => {
        const { value } = event.target;
        setGameData((prevData) => {
            const categories = prevData.category.includes(value)
                ? prevData.category.filter((cat) => cat !== value)
                : [...prevData.category, value];
            return { ...prevData, category: categories };
        });
    };

    const handleLanguageChange = (e) => {
        const { value, checked } = e.target;
        setGameData((prevData) => ({
            ...prevData,
            language: checked
                ? [...prevData.language, value]
                : prevData.language.filter((lang) => lang !== value)
        }));
    };

    const handleSystemRequirementChange = (e, level, field) => {
        const value = e.target.value;
        setGameData((prevData) => ({
            ...prevData,
            systemRequirements: {
                ...prevData.systemRequirements,
                [level]: {
                    ...prevData.systemRequirements[level],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = () => {
        const formData = new FormData();

        formData.append('name', gameData.name);
        formData.append('category', gameData.category.join(','));
        formData.append('description', gameData.description);
        formData.append('price', gameData.price);
        formData.append('players', gameData.players);
        
        gameData.language.forEach((lang) => formData.append('language', lang));
        
        Object.keys(gameData.systemRequirements.minimum).forEach(key => {
            formData.append(`systemRequirements[minimum][${key}]`, gameData.systemRequirements.minimum[key]);
        });
        
        Object.keys(gameData.systemRequirements.recommended).forEach(key => {
            formData.append(`systemRequirements[recommended][${key}]`, gameData.systemRequirements.recommended[key]);
        });

       if (Array.isArray(gameData.platform)) {
           gameData.platform.forEach((platform) => {
               formData.append('platform', platform);
           });
       }

       if (gameData.image) {
           formData.append('image', gameData.image);
       }

       dispatch(updateGame({ gameId, formData }));
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <>
            <Navbar />
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem', backgroundColor: '#041C32', minHeight: '100vh' }}>
                <Box sx={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(202, 202, 202, 0.12)', padding: '2rem', borderRadius: '10px', color: 'white' }}>
                    <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontFamily:'Orbitron' }}>Edit Game</Typography>

                    {/* Formulario de edición */}
                    <TextField label="Nombre" name="name" variant="outlined" fullWidth margin="normal" value={gameData.name} onChange={handleInputChange} InputLabelProps={{ style:{ color:'white' } }} InputProps={{ style:{ color:'white' } }} />

                    {/* Categoría con Checkbox */}
                    <Typography variant="h6" sx={{ mt: 2 }}>Categorías</Typography>
                    <FormGroup row>
                        {['Aventura', 'Acción', 'RPG', 'MOBA', 'Deportes', 'Estrategia', 'Terror', 'FPS','Free To Play'].map((category) => (
                            <FormControlLabel
                                key={category}
                                control={
                                    <Checkbox
                                        checked={gameData.category.includes(category)}
                                        onChange={handleCategoryChange}
                                        value={category}
                                        sx={{ color:'white' }}
                                    />
                                }
                                label={<Typography sx={{ color:'white' }}>{category}</Typography>}
                            />
                        ))}
                    </FormGroup>

                    <TextField label="Descripción" name="description" variant="outlined" fullWidth margin="normal" multiline minRows={3} value={gameData.description} onChange={handleInputChange} InputLabelProps={{ style:{ color:'white' } }} InputProps={{ style:{ color:'white' } }} />

                    <TextField label="Precio" name="price" type="number" variant="outlined" fullWidth margin="normal" value={gameData.price} onChange={handleInputChange} InputLabelProps={{ style:{ color:'white' } }} InputProps={{ style:{ color:'white' } }} />

                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{ color:'white' }}>Plataforma</InputLabel>
                        <Select name="platform" multiple value={gameData.platform} onChange={handlePlatformChange} renderValue={(selected) => selected.join(',')} sx={{ color:'white', '.MuiOutlinedInput-notchedOutline':{ borderColor:'white' } }}>
                            <MenuItem value="Windows">Windows</MenuItem>
                            <MenuItem value="Mac">Mac</MenuItem>
                            <MenuItem value="Linux">Linux</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel sx={{ color:'white' }}>Cantidad de Jugadores</InputLabel>
                        <Select name="players" value={gameData.players} onChange={handleInputChange} sx={{ color:'white', '.MuiOutlinedInput-notchedOutline':{ borderColor:'white' } }}>
                            <MenuItem value="Single-player">Single-player</MenuItem>
                            <MenuItem value="Multi-player">Multi-player</MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="h6" sx={{ mt: 2 }}>Idioma</Typography>
                    <FormGroup row>
                        {['Inglés', 'Español', 'Francés', 'Alemán', 'Chino', 'Japonés', 'Italiano', 'Portugués'].map((lang) => (
                            <FormControlLabel
                                key={lang}
                                control={
                                    <Checkbox
                                        value={lang}
                                        checked={gameData.language.includes(lang)}
                                        onChange={handleLanguageChange}
                                        sx={{ color:'white' }}
                                    />
                                }
                                label={<Typography sx={{ color:'white' }}>{lang}</Typography>}
                            />
                        ))}
                    </FormGroup>

                    <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                        Subir Imagen
                        <input type="file" name="image" hidden onChange={handleFileChange} />
                    </Button>

                    {gameData.imagePreview && (
                        <Box sx={{ mt: 2, textAlign:'center' }}>
                            <img src={gameData.imagePreview} alt="Vista previa" style={{ maxWidth:'100%', height:'auto', borderRadius:'5px' }} />
                        </Box>
                    )}

                    <Typography variant="h6" sx={{ mt: 2 }}>Requerimientos del Sistema</Typography>
                    {['minimum', 'recommended'].map((level) => (
                        <Box key={level} sx={{ mt: 2 }}>
                            <Typography variant="subtitle1" sx={{ color: 'gray', fontStyle: 'italic' }}>
                                {level === 'minimum' ? 'Mínimos' : 'Recomendados'}
                            </Typography>
                            {['cpu', 'gpu', 'ram', 'storage'].map((field) => (
                                <TextField
                                    key={field}
                                    label={field.toUpperCase()}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={gameData.systemRequirements[level][field]}
                                    onChange={(e) => handleSystemRequirementChange(e, level, field)}
                                    InputLabelProps={{ style:{ color:'white' } }}
                                    InputProps={{ style:{ color:'white' } }}
                                />
                            ))}
                        </Box>
                    ))}

                    <Box sx={{ display:'flex', justifyContent:'space-between', mt:'4rem' }}>
                        <Button variant="contained" color="error" onClick={() => navigate('/home')}>Cancelar</Button>
                        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Updating...' : 'Save Changes'}</Button>
                    </Box>
                </Box>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default EditGamePage;
