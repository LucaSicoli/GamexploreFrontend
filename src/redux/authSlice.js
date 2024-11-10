import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Helper functions for managing localStorage
const saveAuthData = ({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Async action for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      const { user } = response.data; // No se obtiene token en esta respuesta
      return { user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to register user';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async action for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;

      saveAuthData({ token, user });

      return { token, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Incorrect email or password';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async action for password reset request
export const resetPasswordRequest = createAsyncThunk(
  'auth/resetPasswordRequest',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password-request`, { email });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to request password reset';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async action for resetting password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userRole: JSON.parse(localStorage.getItem('user'))?.role || null,
    isAuthenticated: !!localStorage.getItem('token'),
    error: null,
    loading: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null;
      state.isAuthenticated = false;
      clearAuthData();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user; // Guardamos el usuario sin el token
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user.role; // Set userRole directly
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(resetPasswordRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPasswordRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password reset request failed';
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password reset failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
