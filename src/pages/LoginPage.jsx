import React, { useEffect, useState } from 'react';
import { TextField, Button, Link, Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false); // Estado para controlar el Snackbar

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setDisplayError(error);
      setShowSnackbar(true); // Muestra el Snackbar cuando hay un error
      const timer = setTimeout(() => {
        setDisplayError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };

  return (
    <div
      style={{
        background: 'linear-gradient(0deg, #062A56 0%, #03152B 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth="sm"
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          borderRadius: '10px',
          backgroundColor: 'rgba(202, 202, 202, 0.12)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            color="white"
            gutterBottom
            style={{ fontFamily: 'Orbitron' }}
          >
            Login
          </Typography>
          <Box
            sx={{
              width: '100%',
              mt: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#FFFFFF',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFFFFF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFFFFF',
                  },
                  '& input': {
                    color: '#FFFFFF',
                  },
                },
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#FFFFFF',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#FFFFFF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FFFFFF',
                  },
                  '& input': {
                    color: '#FFFFFF',
                  },
                },
              }}
            />
            <Button
              variant="contained"
              fullWidth
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#0059ff',
                color: 'white',
              }}
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
            <Link
              onClick={() => {
                dispatch(clearError()); // Limpia el error antes de navegar
                navigate('/forgot-password');
              }}
              underline="hover"
              style={{ marginBottom: '1rem', color: '#CACACA', cursor: 'pointer' }}
            >
              Olvidé mi contraseña
            </Link>

            <Link
              onClick={() => {
                dispatch(clearError()); navigate('/register');
              }}
              underline="hover"
              style={{ color: '#CACACA', cursor: 'pointer' }}
            >
              Crear cuenta
            </Link>
          </Box>
        </Box>
      </Container>
      <Box sx={{ minHeight: '2rem', marginTop: '1rem', textAlign: 'center' }}>
        
      </Box>

      {/* Snackbar para alertas de error */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posición del Snackbar
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {displayError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
