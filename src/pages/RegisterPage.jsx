import React, { useEffect, useState } from 'react';
import { TextField, Button, Link, Container, Typography, Box, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/authSlice';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('gamer');
  const [logo, setLogo] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [description, setDescription] = useState(''); // Estado para la descripción de la empresa
  const [displayError, setDisplayError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    if (registrationSuccess) {
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirigir después de 3 segundos
    }
  }, [registrationSuccess, navigate]);

  useEffect(() => {
    if (error) {
      setDisplayError(error);
      const timer = setTimeout(() => {
        setDisplayError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleRegister = () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);
    formData.append('dateOfBirth', dateOfBirth);

    if (logo) {
      formData.append('logo', logo);
    }

    if (role === 'empresa' && description) {
      formData.append('description', description); // Agregar descripción si el rol es empresa
    }

    dispatch(registerUser(formData))
      .unwrap()
      .then(() => setRegistrationSuccess(true))
      .catch(() => setRegistrationSuccess(false));
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
            Registro
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
            {/* Campos de entrada */}
            <TextField
              label="Nombre"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <TextField
              label="Fecha de Nacimiento"
              type="date"
              variant="outlined"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true, style: { color: '#FFFFFF' } }}
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
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
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
                  '& .MuiSelect-select': {
                    color: '#FFFFFF',
                  },
                },
              }}
            >
              <MenuItem value="gamer">Gamer</MenuItem>
              <MenuItem value="empresa">Empresa</MenuItem>
            </TextField>
            {role === 'empresa' && (
              <>
                <TextField
                  label="Descripción de la Empresa"
                  variant="outlined"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                  label="Logo de la Empresa"
                  type="file"
                  onChange={(e) => setLogo(e.target.files[0])}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                    style: {
                      color: '#FFFFFF',
                    },
                  }}
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
                    },
                    '& input': {
                      color: '#FFFFFF',
                    },
                  }}
                  inputProps={{
                    title: 'Seleccionar logotipo',
                  }}
                />
              </>
            )}
            <Button
              variant="contained"
              fullWidth
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#0059ff',
                color: 'white',
              }}
              onClick={handleRegister}
            >
              Registrarse
            </Button>
            <Link
              onClick={() => {
                dispatch(clearError()); navigate('/');
              }}
              underline="hover"
              style={{ color: '#CACACA', cursor: 'pointer' }}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </Link>
          </Box>
        </Box>
      </Container>
      <Box sx={{ minHeight: '2rem', marginTop: '1rem', textAlign: 'center' }}>
        {registrationSuccess && (
          <Typography color="success" style={{ width: '100%', color: 'green' }}>
            Usuario creado exitosamente.
          </Typography>
        )}
        {displayError && (
          <Typography color="error" style={{ width: '100%' }}>
            {displayError}
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default RegisterPage;
