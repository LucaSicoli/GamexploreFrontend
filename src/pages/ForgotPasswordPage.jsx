import React, { useEffect, useState } from 'react';
import { TextField, Button, Link, Container, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordRequest, clearError } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [displayError, setDisplayError] = useState(null);

  // Limpiar el error al montar la página
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Manejar el error y mostrarlo por 3 segundos
  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout(() => setDisplayError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleResetPasswordRequest = () => {
    dispatch(resetPasswordRequest({ email })).then((response) => {
      if (!response.error) {
        setEmailSent(true);
      }
    });
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h4"
            component="h1"
            color="white"
            gutterBottom
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Restablecer Contraseña
          </Typography>
          <Box
            sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <TextField
              label="Correo Electrónico"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: '#FFFFFF' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#FFFFFF', borderWidth: '1px' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-disabled input': { color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' },
                  '& input': { color: '#FFFFFF' },
                },
              }}
              disabled={emailSent}
            />
            <Button
              variant="contained"
              fullWidth
              style={{ marginTop: '1rem', marginBottom: '1rem', backgroundColor: '#0059ff', color: 'white' }}
              onClick={handleResetPasswordRequest}
              disabled={loading || emailSent}
            >
              {emailSent ? 'Hemos enviado el enlace a tu correo' : loading ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
            </Button>
            <Link
              component="button"
              onClick={() => {
                dispatch(clearError());
                navigate('/login')}
              }underline="hover"
              sx={{ color: '#CACACA', marginTop: '1rem', cursor: 'pointer', fontSize: '1rem', textTransform: 'none' }}
            >
              volver atrás
            </Link>
          </Box>
        </Box>
      </Container>
      <Box sx={{ minHeight: '2rem', marginTop: '1rem', textAlign: 'center' }}>
        {displayError && (
          <Typography color="error" style={{ width: '100%' }}>
            {displayError}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default ForgotPasswordPage;
