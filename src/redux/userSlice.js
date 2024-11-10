// src/redux/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk para obtener los datos detallados de los juegos del usuario
export const fetchUserGames = createAsyncThunk('user/fetchUserGames', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const userId = JSON.parse(localStorage.getItem('user')).id;

    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Devuelve los juegos completos con sus detalles y comentarios
    return { user: response.data, games: response.data.games };
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error al obtener los datos del usuario');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    games: [],
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
      .addCase(fetchUserGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserGames.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.games = action.payload.games;
      })
      .addCase(fetchUserGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserData } = userSlice.actions;

export default userSlice.reducer;
