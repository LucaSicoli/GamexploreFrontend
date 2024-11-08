import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword, clearError } from '../redux/authSlice';

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const { loading, error } = useSelector((state) => state.auth);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayError, setDisplayError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [buttonText, setButtonText] = useState('Restablecer Contraseña');

  useEffect(() => {
    // Limpiar errores al montar el componente
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout(() => {
        setDisplayError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    dispatch(resetPassword({ token, newPassword })).then((response) => {
      if (!response.error) {
        setIsDisabled(true);
        setButtonText('¡Contraseña restablecida exitosamente!');
        setTimeout(() => {
          navigate('/login');
        }, 5000);
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
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Restablecer Contraseña
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
              label="Nueva Contraseña"
              type="password"
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
              disabled={loading || isDisabled}
            />
            <TextField
              label="Confirmar Contraseña"
              type="password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={loading || isDisabled}
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
              onClick={handleResetPassword}
              disabled={loading || isDisabled}
            >
              {buttonText}
            </Button>
            <Button
              variant="text"
              fullWidth
              style={{
                color: '#CACACA',
                marginTop: '1rem',
                textDecoration: 'underline',
              }}
              onClick={() => navigate('/login')}
              disabled={isDisabled}
            >
              Volver Atrás
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{ minHeight: '2rem', marginTop: '1rem', textAlign: 'center' }}>
        {displayError && (
          <Typography color="error" style={{ width: '100%', fontFamily: 'Orbitron, sans-serif' }}>
            {displayError}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default ResetPasswordPage;
