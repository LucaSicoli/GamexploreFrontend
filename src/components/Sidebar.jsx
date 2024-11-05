// Sidebar.jsx
import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Radio, RadioGroup, Slider } from '@mui/material';

const Sidebar = ({ filters, onFilterChange, onPriceChange }) => {
  return (
    <Box
      sx={{
        width: '220px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        padding: '1rem',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        border: '2px solid grey',
        height: '600px',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Filtros
      </Typography>

      <Typography variant="subtitle2" gutterBottom>
        Categoría
      </Typography>
      {['Aventura', 'Acción', 'RPG', 'MOBA'].map((category) => (
        <FormControlLabel
          key={category}
          control={<Checkbox name="category" value={category} onChange={onFilterChange} />}
          label={category}
          sx={{ color: 'white' }}
        />
      ))}

      <Typography variant="subtitle2" gutterBottom>
        Precio Máximo
      </Typography>
      <Slider
        value={filters.maxPrice}
        onChange={onPriceChange}
        min={0}
        max={100}
        valueLabelDisplay="auto"
        sx={{ color: 'white' }}
      />

      <Typography variant="subtitle2" gutterBottom>
        Sistema Operativo
      </Typography>
      <RadioGroup name="platform" onChange={onFilterChange}>
        {['Windows', 'Mac', 'Linux'].map((platform) => (
          <FormControlLabel
            key={platform}
            control={<Radio />}
            label={platform}
            value={platform}
            sx={{ color: 'white' }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};

export default Sidebar;
