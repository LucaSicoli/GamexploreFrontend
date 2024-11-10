// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para obtener los datos del usuario y sus juegos
export const fetchUserData = createAsyncThunk('user/fetchUserData', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token'); // Usando el token del localStorage si es necesario
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    // Si el backend no incluye los datos completos de los juegos, realiza solicitudes adicionales para obtenerlos
    const gameIds = response.data.games || [];
    const games = await Promise.all(
      gameIds.map(gameId => 
        axios.get(`${process.env.REACT_APP_API_URL}/games/${gameId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.data)
      )
    );

    return { user: response.data, games }; // Incluye los juegos en el payload
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error al obtener los datos del usuario');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    games: [], // Almacena los juegos del usuario aquí
    loading: false,
    error: null,
  },
  reducers: {
    clearUserData: (state) => {
      state.user = null;
      state.games = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.games = action.payload.games; // Guarda los juegos obtenidos
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserData } = userSlice.actions;

export default userSlice.reducer;
