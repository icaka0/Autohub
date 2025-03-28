import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';
import { checkAuthStatus, logoutUser } from '../../services/api';

const Home = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check auth status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Home: Checking authentication status...');
        const userData = await checkAuthStatus();
        console.log('Home: Authentication result:', userData);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      // Reset user and reload page
      setCurrentUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
  return (
    <div className="home">
      {/* Header section with logo and authentication buttons */}
      <header className="home-header">
        <div className="logo-container">
          <h1 className="logo">AutoHub</h1>
        </div>
        <div className="auth-buttons">
          {loading ? (
            <span>Loading...</span>
          ) : currentUser ? (
            <>
              <span className="welcome-message">Welcome, {currentUser.firstName}!</span>
              <Link to="/profile" className="btn profile-btn">Profile</Link>
              <button onClick={handleLogout} className="btn logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn login-btn">Login</Link>
              <Link to="/register" className="btn register-btn">Register</Link>
            </>
          )}
        </div>
      </header>
      
      {/* Main content section with hero banner */}
      <main className="home-main">
        <div className="hero">
          <h2 className="hero-title">Welcome to AutoHub</h2>
          <p className="hero-subtitle">Buy, Sell, and Rent Classic and Modern Vehicles</p>
          {/* Action buttons for main user functions */}
          <div className="hero-buttons">
            <Link to="/browse" className="btn btn-primary">Browse Vehicles</Link>
            <button className="btn btn-secondary">Sell Your Car</button>
            <button className="btn btn-secondary">Rent a Car</button>
          </div>
        </div>
      </main>
      
      {/* Footer with copyright information */}
      <footer className="home-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
