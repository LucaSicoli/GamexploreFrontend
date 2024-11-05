// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import gameReducer from './gameSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice';
import filterReducer from './filterSlice'; // Import the new filterSlice

const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    filter: filterReducer, // Add filterSlice to the store
  },
});

export default store;
