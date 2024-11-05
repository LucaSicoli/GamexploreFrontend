import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Acción asincrónica para registrar un usuario
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, formData);
      const { token, user } = response.data;

      // Guarda token, usuario y rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);

      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al registrar usuario');
    }
  }
);

// Acción asincrónica para iniciar sesión
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      
      // Guarda token, usuario y rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al iniciar sesión');
    }
  }
);

// Acción asincrónica para solicitar restablecimiento de contraseña
export const resetPasswordRequest = createAsyncThunk(
  'auth/resetPasswordRequest',
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password-request`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al solicitar el restablecimiento de contraseña');
    }
  }
);

// Acción asincrónica para restablecer la contraseña
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, { token, newPassword });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error al restablecer la contraseña');
    }
  }
);

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    userRole: localStorage.getItem('userRole') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    error: null,
    loading: false,
  },
  reducers: {
    // Acción para cerrar sesión
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null;
      state.isAuthenticated = false;

      // Elimina el token, usuario y rol del localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    },
    // Acción para limpiar errores
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
        state.user = action.payload.user;
        state.isAuthenticated = false; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al registrar el usuario';
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.user.role;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Error al iniciar sesión';
        state.isAuthenticated = false;
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
        state.error = action.payload?.message || 'Error al solicitar el restablecimiento de contraseña';
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
        state.error = action.payload?.message || 'Error al restablecer la contraseña';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
