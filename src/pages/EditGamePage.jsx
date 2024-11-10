import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, FormGroup } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchGameById, updateGame, clearError, clearSuccessMessage } from '../redux/gameSlice';

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

    useEffect(() => {
        dispatch(fetchGameById(gameId));
    }, [dispatch, gameId]);

    useEffect(() => {
        if (game) {
            setGameData({
                name: game.name,
                category: game.category || [],
                description: game.description,
                price: game.price,
                players: game.players,
                language: game.language || [],
                platform: game.platform || [],
                systemRequirements: game.systemRequirements,
                imagePreview: game.imageUrl
            });
        }
    }, [game]);

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
        formData.append('category', gameData.category.join(', '));
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

    useEffect(() => {
        if (error) {
            setTimeout(() => dispatch(clearError()), 3000);
        }

        if (successMessage) {
            setTimeout(() => {
                dispatch(clearSuccessMessage());
                navigate('/home');
            }, 5000);
        }
    }, [error, successMessage, dispatch, navigate]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(0deg, #062A56 0%, #03152B 100%)', minHeight: '100vh' }}>
            <Box sx={{ width: '100%', maxWidth: '700px', backgroundColor: 'rgba(202, 202, 202, 0.12)', padding: '2rem', borderRadius: '10px', color: 'white' }}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: 'center', fontFamily: 'Orbitron' }}>Edit Game</Typography>

                {/* Formulario de edición */}
                <TextField label="Nombre" name="name" variant="outlined" fullWidth margin="normal" value={gameData.name} onChange={handleInputChange} InputLabelProps={{ style: { color: 'white' } }} InputProps={{ style: { color: 'white' } }} />

                <Typography variant="h6" sx={{ mt: 2 }}>Categorías</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Aventura', 'Acción', 'RPG', 'MOBA', 'Deportes', 'Estrategia', 'Terror', 'FPS', 'Free To Play'].map((category) => (
                        <FormControlLabel
                            key={category}
                            control={
                                <Checkbox
                                    value={category}
                                    checked={gameData.category.includes(category)}
                                    onChange={handleCategoryChange}
                                    sx={{ color: 'white' }}
                                />
                            }
                            label={<Typography sx={{ color: 'white' }}>{category}</Typography>}
                        />
                    ))}
                </Box>

                <TextField label="Descripción" name="description" variant="outlined" fullWidth margin="normal" multiline minRows={3} value={gameData.description} onChange={handleInputChange} InputLabelProps={{ style: { color: 'white' } }} InputProps={{ style: { color: 'white' } }} />

                <TextField label="Precio" name="price" type="number" variant="outlined" fullWidth margin="normal" value={gameData.price} onChange={handleInputChange} InputLabelProps={{ style: { color: 'white' } }} InputProps={{ style: { color: 'white' } }} />

                <FormControl fullWidth margin="normal">
                    <InputLabel sx={{ color: 'white' }}>Plataforma</InputLabel>
                    <Select name="platform" multiple value={gameData.platform} onChange={handlePlatformChange} renderValue={(selected) => selected.join(', ')} sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}>
                        <MenuItem value="Windows">Windows</MenuItem>
                        <MenuItem value="Mac">Mac</MenuItem>
                        <MenuItem value="Linux">Linux</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>Subir Imagen
                    <input type="file" name="image" hidden onChange={handleFileChange} />
                </Button>

                {gameData.imagePreview && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <img src={gameData.imagePreview} alt="Vista previa" style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button variant="contained" color="error" onClick={() => navigate('/home')}>Cancelar</Button>
                    <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Updating...' : 'Save Changes'}</Button>
                </Box>

                {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
                {successMessage && <Typography color="success" sx={{ mt: 2 }}>{successMessage}</Typography>}
            </Box>
        </Box>
    );
};

export default EditGamePage;
