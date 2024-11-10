// src/redux/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const filterSlice = createSlice({
  name: 'filter',
  initialState: {
    category: [],
    platform: '',
    maxPrice: 100,
    search: '',
    players: [],
    language: [],
    rating: 0,
  },
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setPlatform: (state, action) => {
      state.platform = action.payload;
    },
    setMaxPrice: (state, action) => {
      state.maxPrice = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setPlayers: (state, action) => {
      state.players = action.payload;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setRating: (state, action) => {
      state.rating = action.payload;
    },
    clearFilters: (state) => {
      state.category = [];
      state.platform = '';
      state.maxPrice = 100;
      state.search = '';
      state.players = [];
      state.language = [];
      state.rating = 0;
    },
  },
});

export const {
  setCategory,
  setPlatform,
  setMaxPrice,
  setSearch,
  setPlayers,
  setLanguage,
  setRating,
  clearFilters,
} = filterSlice.actions;

export default filterSlice.reducer;
