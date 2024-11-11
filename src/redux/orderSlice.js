// src/redux/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to create an order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const { formData } = getState().order; // Access formData from the order state
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/checkout`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error creating order');
    }
  }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
      formData: {
        cardName: '',
        cardNumber: '',
        cardCVC: '',
        cardExpiry: '',
        address: '',
        country: '',
        province: '',
        city: '',
        postalCode: '',
      },
      order: null,
      loading: false,
      error: null,
    },
    reducers: {
      updateFormField: (state, action) => {
        const { field, value } = action.payload;
        state.formData[field] = value;
      },
      clearFormData: (state) => {
        state.formData = {
          cardName: '',
          cardNumber: '',
          cardCVC: '',
          cardExpiry: '',
          address: '',
          country: '',
          province: '',
          city: '',
          postalCode: '',
        };
      },
      clearError: (state) => {
        state.error = null;
      },
      clearOrder: (state) => {
        state.order = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(createOrder.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createOrder.fulfilled, (state, action) => {
          state.loading = false;
          state.order = action.payload;
          state.formData = {
            cardName: '',
            cardNumber: '',
            cardCVC: '',
            cardExpiry: '',
            address: '',
            country: '',
            province: '',
            city: '',
            postalCode: '',
          };
        })
        .addCase(createOrder.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  
  export const { updateFormField, clearFormData, clearError, clearOrder } = orderSlice.actions;
  export default orderSlice.reducer;