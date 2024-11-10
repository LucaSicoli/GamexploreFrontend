// src/redux/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunk to fetch cart data
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to fetch cart" });
  }
});

// Thunk to add an item to the cart
export const addToCart = createAsyncThunk('cart/addToCart', async ({ gameId, quantity }, { dispatch, rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/cart/items`,
      { gameId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Dispatch incrementCartCount action to always increase the count by quantity
    dispatch(incrementCartCount(quantity));

    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to add item to cart" });
  }
});

// Thunk to remove an item from the cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (gameId, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    const response = await axios.delete(`${process.env.REACT_APP_API_URL}/cart/items`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { gameId },  // Ensure the gameId is being sent correctly
    });
    return response.data.cart;
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to remove item from cart" });
  }
});


// Thunk to increase quantity
export const increaseCartQuantity = createAsyncThunk('cart/increaseQuantity', async (gameId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart/increase`, { gameId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to increase item quantity" });
    }
  });
  
  // Thunk to decrease quantity
  export const decreaseCartQuantity = createAsyncThunk('cart/decreaseQuantity', async (gameId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/cart/decrease`, { gameId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.cart;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to decrease item quantity" });
    }
  });
  

// Thunk to clear the cart
export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${process.env.REACT_APP_API_URL}/cart`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { items: [], totalItems: 0, totalPrice: 0 }; // Reset cart state
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Failed to clear cart" });
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null; // Manually reset the error state
    },
    incrementCartCount: (state, action) => {
      state.totalItems += action.payload; // Increment totalItems by the quantity added
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors on new fetch
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
        state.totalItems = action.payload.items.reduce((total, item) => total + item.quantity, 0); // Calculate totalItems
        state.totalPrice = action.payload.totalPrice;
        state.error = null; // Clear any error if fetch was successful
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Capture error message
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
        state.error = null; // Clear any error if add was successful
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.items.reduce((total, item) => total + item.quantity, 0); // Recalculate totalItems
        state.totalPrice = action.payload.totalPrice;
        state.error = null; // Clear any error if remove was successful
      })
      .addCase(increaseCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.items.reduce((total, item) => total + item.quantity, 0); // Recalculate totalItems
        state.totalPrice = action.payload.totalPrice;
        state.error = null; // Clear any error if increase was successful
      })
      .addCase(decreaseCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalItems = action.payload.items.reduce((total, item) => total + item.quantity, 0); // Recalculate totalItems
        state.totalPrice = action.payload.totalPrice;
        state.error = null; // Clear any error if decrease was successful
      })
      .addCase(clearCart.fulfilled, (state) => {
        // Clear items and reset totalItems and totalPrice immediately
        state.items = [];
        state.totalItems = 0;
        state.totalPrice = 0;
        state.error = null; // Clear any error if clear was successful
      });
  },
});

export const { resetError, incrementCartCount } = cartSlice.actions;

export default cartSlice.reducer;
