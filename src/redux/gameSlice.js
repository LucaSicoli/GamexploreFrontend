// src/redux/gameSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción asíncrona para crear un juego
export const createGame = createAsyncThunk(
    'game/createGame',
    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/games`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción asíncrona para obtener los juegos de la empresa
export const fetchCompanyGames = createAsyncThunk(
    'game/fetchCompanyGames',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/games/company`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción asíncrona para alternar el estado de publicación de un juego
export const togglePublishGame = createAsyncThunk(
    'game/togglePublishGame',
    async (gameId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/games/publish/${gameId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { gameId, isPublished: response.data.isPublished };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Acción asíncrona para eliminar un juego
export const deleteGame = createAsyncThunk(
    'game/deleteGame',
    async (gameId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/games/${gameId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return gameId; // Retorna el ID del juego eliminado
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete game');
        }
    }
);

// Acción asíncrona para incrementar las visualizaciones de un juego
export const incrementGameViews = createAsyncThunk(
    'game/incrementGameViews',
    async (gameId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/games/${gameId}/views`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return { gameId, views: response.data.views }; // Retorna el ID del juego y el nuevo conteo de visualizaciones
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error incrementing game views');
        }
    }
);

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        game: null,
        companyGames: [],
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Manejo de createGame
            .addCase(createGame.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createGame.fulfilled, (state, action) => {
                state.loading = false;
                state.game = action.payload.game;
                state.successMessage = 'Game created successfully.';
            })
            .addCase(createGame.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error creating the game.';
            })

            // Manejo de fetchCompanyGames
            .addCase(fetchCompanyGames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyGames.fulfilled, (state, action) => {
                state.loading = false;
                state.companyGames = action.payload;
            })
            .addCase(fetchCompanyGames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error fetching company games.';
            })

            // Manejo de togglePublishGame
            .addCase(togglePublishGame.pending, (state) => {
                state.loading = true;
            })
            .addCase(togglePublishGame.fulfilled, (state, action) => {
                state.loading = false;
                const { gameId, isPublished } = action.payload;
                const game = state.companyGames.find((g) => g._id === gameId);
                if (game) {
                    game.isPublished = isPublished;
                }
            })
            .addCase(togglePublishGame.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error toggling publish status.';
            })

            // Manejo de deleteGame
            .addCase(deleteGame.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteGame.fulfilled, (state, action) => {
                state.loading = false;
                state.companyGames = state.companyGames.filter((game) => game._id !== action.payload);
            })
            .addCase(deleteGame.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Manejo de incrementGameViews
            .addCase(incrementGameViews.pending, (state) => {
                state.loading = true;
            })
            .addCase(incrementGameViews.fulfilled, (state, action) => {
                state.loading = false;
                const { gameId, views } = action.payload;
                const game = state.companyGames.find((g) => g._id === gameId);
                if (game) {
                    game.views = views;
                }
                if (state.game && state.game._id === gameId) {
                    state.game.views = views;
                }
            })
            .addCase(incrementGameViews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearSuccessMessage } = gameSlice.actions;
export default gameSlice.reducer;
