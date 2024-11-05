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

const gameSlice = createSlice({
    name: 'game',
    initialState: {
        game: null,
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
            .addCase(createGame.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createGame.fulfilled, (state, action) => {
                state.loading = false;
                state.game = action.payload.game;
                state.successMessage = 'Juego creado con éxito.';
            })
            .addCase(createGame.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Error al crear el juego.';
            });
    },
});

export const { clearError, clearSuccessMessage } = gameSlice.actions;
export default gameSlice.reducer;
