// FilterComponent.jsx
import React from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Slider, Radio, RadioGroup } from '@mui/material';

const FilterComponent = ({ filters, onFilterChange, onPriceChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: '5px',
      }}
    >
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: '220px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '1rem',
          marginLeft: '2rem',
          color: 'white',
          border: '2px solid grey',
          height: '620px',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        {/* Filtro de Categoría */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="subtitle2">Categoría</Typography>
          {['Aventura', 'Acción', 'RPG', 'MOBA', 'FPS', 'Estrategia', 'Free To Play'].map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={onFilterChange}
                  sx={{ color: 'white' }}
                />
              }
              label={category}
            />
          ))}
        </Box>

        {/* Filtro de Precio Máximo */}
        <Box 
          sx={{ 
            marginTop: '1rem',
            display: 'flex', 
            flexDirection: 'column',
            marginBottom: '1rem',
          }}
        >
          <Typography variant="subtitle2">Precio Máximo</Typography>
          <Slider
            value={filters.maxPrice}
            onChange={onPriceChange}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            sx={{
              color: 'white',
            }}
          />
        </Box>

        {/* Filtro de Sistema Operativo */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.5rem',
            marginTop: '1rem',
          }}
        >
          <Typography variant="subtitle2">Sistema Operativo</Typography>
          <RadioGroup name="platform" value={filters.platform} onChange={onFilterChange}>
            {['Windows', 'Mac', 'Linux'].map((platform) => (
              <FormControlLabel
                key={platform}
                control={<Radio sx={{ color: 'white' }} />}
                label={platform}
                value={platform}
              />
            ))}
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterComponent;
