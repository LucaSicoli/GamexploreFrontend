import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  Modal,
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, updateFormField, clearError, clearOrder } from '../redux/orderSlice';
import { useNavigate } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { formData, loading, error} = useSelector((state) => state.order);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(clearOrder());
    setShowModal(false);
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardExpiry") {
      let formattedValue = value.replace(/\D/g, "").slice(0, 4);
      if (formattedValue.length >= 3) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2)}`;
      }
      dispatch(updateFormField({ field: name, value: formattedValue }));
    } else if (name === "cardCVC") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 4);
      dispatch(updateFormField({ field: name, value: formattedValue }));
    } else {
      dispatch(updateFormField({ field: name, value }));
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-');
    dispatch(updateFormField({ field: 'cardNumber', value: formattedValue }));
  };

  const handleConfirmPurchase = async () => {
    const resultAction = await dispatch(createOrder());
    if (createOrder.fulfilled.match(resultAction)) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  const handleCancel = () => {
    dispatch(clearError());
    navigate('/cart');
  };

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
            textAlign: 'center',
            marginBottom: '1rem',
          }}
        >
          Checkout
        </Typography>

        <Divider sx={{ backgroundColor: 'white', margin: { xs: '1rem 0', md: '2rem 0' } }} />

        <Container
          maxWidth="md"
          sx={{
            backgroundColor: 'rgba(202, 202, 202, 0.2)',
            padding: '2rem',
            borderRadius: '10px',
            width: '100%',
            maxWidth: '800px',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', marginBottom: '1rem' }}>Detalles de la compra</Typography>

          <Box display="flex" flexDirection="column" gap="1rem">
            <TextField
              label="Nombre (Como Figura En La Tarjeta)"
              name="cardName"
              value={formData.cardName}
              onChange={handleInputChange}
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
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
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
              name="cardCVC"
              value={formData.cardCVC}
              onChange={handleInputChange}
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
              label="Fecha De Vencimiento (MM/YY)"
              name="cardExpiry"
              value={formData.cardExpiry}
              onChange={handleInputChange}
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
              name="address"
              value={formData.address}
              onChange={handleInputChange}
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
                name="country"
                value={formData.country}
                onChange={handleInputChange}
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
                name="province"
                value={formData.province}
                onChange={handleInputChange}
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
                name="city"
                value={formData.city}
                onChange={handleInputChange}
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
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
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
            <Button variant="contained" color="secondary" sx={{ backgroundColor: 'red' }} onClick={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmPurchase}
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar compra'}
            </Button>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}
        </Container>
      </Box>

      {/* Modal for Thank You message */}
      <Modal open={showModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: '#003366',
            color: 'white',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
            borderRadius: '10px',
            maxWidth: '300px',
          }}
        >
          {/* Star decoration */}
          <Box display="flex" justifyContent="center" mb={2}>
            {[...Array(5)].map((_, index) => (
              <StarIcon key={index} sx={{ color: '#FFD700', fontSize: '2rem' }} />
            ))}
          </Box>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Muchas gracias por comprar en GameXplore
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Thanks for buying at GameXplore
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
            sx={{
              backgroundColor: '#1E88E5',
              color: 'white',
              '&:hover': { backgroundColor: '#1565C0' },
              mt: 2,
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default CheckoutPage;
