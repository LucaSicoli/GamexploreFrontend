import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Homepage from './pages/HomePage';
import CreateGamePage from './pages/CreateGamePage';
import GameDetails from './pages/GameDetails';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import Profile from './pages/Profile'; // Import Profile page
import CheckoutPage from './pages/CheckoutPage';
import EditGamePage from './pages/EditGamePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/create-game" element={<CreateGamePage />} />
        <Route path="/game/:gameId" element={<GameDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<Profile />} /> {/* Add the Profile route */}
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/edit-game/:gameId" element={<EditGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;

