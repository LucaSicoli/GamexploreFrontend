import React from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import Navbar from '../components/Navbar';

const CheckoutPage = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ padding: { xs: '1rem', md: '2rem' }, backgroundColor: '#041C32', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
            color: 'white',
            fontFamily: 'Orbitron',
            fontSize: { xs: '1.5rem', md: '2rem' },
            textAlign: 'center', // Center align the text
            marginBottom: '1rem',
        }}
        >
        Checkout
        </Typography>

        <Divider
  sx={{
    backgroundColor: 'white',
    margin: { xs: '1rem 0', md: '2rem 0' }, // Increased margin for both mobile and desktop
  }}
/>


        <Container
          maxWidth="md" // Adjust the maximum width to 'md' or 'lg' for a wider form
          sx={{
            backgroundColor: 'rgba(202, 202, 202, 0.2)',
            padding: '2rem',
            borderRadius: '10px',
            width: '100%', // Ensures it takes up the available width
            maxWidth: '800px', // Set a custom max width for larger screens
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', marginBottom: '1rem' }}>Detalles de la compra</Typography>
          
          <Box display="flex" flexDirection="column" gap="1rem">
            <TextField
              label="Nombre (Como Figura En La Tarjeta)"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{
                style: { color: 'white', caretColor: 'white' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#FFFFFF' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                  '& input': { color: 'white', caretColor: 'white' },
                },
              }}
            />
            <TextField
              label="Número De La Tarjeta"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{
                style: { color: 'white', caretColor: 'white' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#FFFFFF' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                  '& input': { color: 'white', caretColor: 'white' },
                },
              }}
            />
            <TextField
              label="Código Del Dorso De La Tarjeta"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{
                style: { color: 'white', caretColor: 'white' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#FFFFFF' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                  '& input': { color: 'white', caretColor: 'white' },
                },
              }}
            />
            <TextField
              label="Fecha De Vencimiento"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{
                style: { color: 'white', caretColor: 'white' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#FFFFFF' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                  '& input': { color: 'white', caretColor: 'white' },
                },
              }}
            />
          </Box>

          <Typography variant="h6" sx={{ color: 'white', marginTop: '2rem', marginBottom: '1rem' }}>Dirección</Typography>
          <Box display="flex" flexDirection="column" gap="1rem">
            <TextField
              label="Dirección"
              variant="outlined"
              fullWidth
              InputLabelProps={{ style: { color: 'white' } }}
              InputProps={{
                style: { color: 'white', caretColor: 'white' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#FFFFFF' },
                  '&:hover fieldset': { borderColor: '#FFFFFF' },
                  '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                  '& input': { color: 'white', caretColor: 'white' },
                },
              }}
            />
            <Box display="flex" gap="1rem">
              <TextField
                label="País"
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: { color: 'white', caretColor: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FFFFFF' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                    '& input': { color: 'white', caretColor: 'white' },
                  },
                }}
              />
              <TextField
                label="Provincia"
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: { color: 'white', caretColor: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FFFFFF' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                    '& input': { color: 'white', caretColor: 'white' },
                  },
                }}
              />
            </Box>
            <Box display="flex" gap="1rem">
              <TextField
                label="Ciudad"
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: { color: 'white', caretColor: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FFFFFF' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                    '& input': { color: 'white', caretColor: 'white' },
                  },
                }}
              />
              <TextField
                label="Código Postal"
                variant="outlined"
                fullWidth
                InputLabelProps={{ style: { color: 'white' } }}
                InputProps={{
                  style: { color: 'white', caretColor: 'white' },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#FFFFFF' },
                    '&:hover fieldset': { borderColor: '#FFFFFF' },
                    '&.Mui-focused fieldset': { borderColor: '#FFFFFF' },
                    '& input': { color: 'white', caretColor: 'white' },
                  },
                }}
              />
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" marginTop="2rem">
            <Button variant="contained" color="secondary" sx={{ backgroundColor: 'red' }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary">
              Confirmar compra
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default CheckoutPage;
