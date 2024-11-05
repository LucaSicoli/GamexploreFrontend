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


const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false, error: null },
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
       
      });
  },
});

export default wishlistSlice.reducer;
