// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import gameReducer from './gameSlice';
import cartReducer from './cartSlice';
import wishlistReducer from './wishlistSlice'; // Importa el reducer de wishlistSlice

const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    cart: cartReducer, // Asegúrate de que este reducer esté incluido
    wishlist: wishlistReducer, // Incluye el reducer de wishlist
  },
});

export default store;
