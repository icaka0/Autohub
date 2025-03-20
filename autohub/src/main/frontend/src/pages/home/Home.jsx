import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = () => {
  return (
    <div className="home">
      {/* Header section with logo and authentication buttons */}
      <header className="home-header">
        <div className="logo-container">
          <h1 className="logo">AutoHub</h1>
        </div>
        <div className="auth-buttons">
          {/* Navigation links styled as buttons */}
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn register-btn">Register</Link>
        </div>
      </header>
      
      {/* Main content section with hero banner */}
      <main className="home-main">
        <div className="hero">
          <h2 className="hero-title">Welcome to AutoHub</h2>
          <p className="hero-subtitle">Buy, Sell, and Rent Classic and Modern Vehicles</p>
          {/* Action buttons for main user functions */}
          <div className="hero-buttons">
            <button className="btn btn-primary">Browse Cars</button>
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
