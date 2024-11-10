// src/redux/wishlistSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getWishlist = createAsyncThunk('wishlist/getWishlist', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.games;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error al obtener la wishlist');
  }
});

export const removeFromWishlist = createAsyncThunk('wishlist/removeFromWishlist', async ({ gameId }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { gameId },
    });
    return gameId; // Retorna el ID del juego eliminado
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error al eliminar el juego de la wishlist');
  }
});

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ gameName }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/wishlist`, { name: gameName }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Retorna el mensaje
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Error al agregar el juego a la wishlist');
  }
});

// Nueva acción para obtener el número de usuarios que tienen un juego en su wishlist
export const fetchWishlistCountForGame = createAsyncThunk(
  'wishlist/fetchWishlistCountForGame',
  async (gameId, { rejectWithValue }) => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist/${gameId}/count`);
          return { gameId, count: response.data.count };
      } catch (error) {
          return rejectWithValue(error.response?.data || 'Error fetching wishlist count');
      }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    counts: {}, // Almacena los conteos de wishlist por gameId
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((game) => game._id !== action.payload); // Usa _id
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // Agrega el juego a la lista de items si se agregó correctamente
      })
      .addCase(fetchWishlistCountForGame.fulfilled, (state, action) => {
        const { gameId, count } = action.payload;
        state.counts[gameId] = count;
      })
      .addCase(fetchWishlistCountForGame.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
