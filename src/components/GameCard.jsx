// GameCard.jsx
import React from 'react';
import { Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';

const GameCard = ({ game }) => {
  return (
    <Grid item xs={12} sm={6} md={4} key={game._id}>
      <Card
        sx={{
          maxWidth: '350px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <CardMedia
          component="img"
          height="160"
          image={game.imageUrl}
          alt={game.name}
          sx={{ borderRadius: '8px 8px 0 0' }}
        />
        <CardContent>
          <Typography gutterBottom variant="body1" component="div" style={{ color: 'white' }}>
            {game.name}
          </Typography>
          <Typography variant="body2" style={{ color: '#d1d1d1' }}>
            {game.category}
          </Typography>
          <Typography variant="body1" style={{ color: '#00e676' }}>
            ${game.price}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default GameCard;
