import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Favorites.scss';
import { checkAuthStatus, getFavorites, removeFromFavorites, logoutUser } from '../../services/api';

const Favorites = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const init = async () => {
      try {
        // Check auth status
        const userData = await checkAuthStatus();
        if (!userData) {
          navigate('/login');
          return;
        }
        setCurrentUser(userData);
        
        // Fetch favorites
        const favoritesData = await getFavorites();
        setFavorites(favoritesData);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    init();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  const handleRemoveFromFavorites = async (adId) => {
    try {
      await removeFromFavorites(adId);
      // Update the favorites list by filtering out the removed ad
      setFavorites(favorites.filter(ad => ad.id !== adId));
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove from favorites. Please try again.');
    }
  };
  
  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };
  
  if (loading) {
    return <div className="loading">Loading favorites...</div>;
  }
  
  return (
    <div className="favorites-page">
      <header className="favorites-header">
        <div className="logo-container">
          <Link to="/">
            <h1 className="logo">AutoHub</h1>
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/browse" className="btn browse-btn">Browse Vehicles</Link>
          <Link to="/profile" className="btn profile-btn">Profile</Link>
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="favorites-main">
        <div className="container">
          <h1 className="favorites-title">My Favorite Vehicles</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          {favorites.length === 0 ? (
            <div className="no-favorites-message">
              <p>You don't have any favorite vehicles yet.</p>
              <Link to="/browse" className="btn browse-btn">Browse Vehicles</Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map(vehicle => (
                <div key={vehicle.id} className="favorite-card">
                  <div className="favorite-image">
                    <img 
                      src={vehicle.imageUrls && vehicle.imageUrls.length > 0 
                        ? vehicle.imageUrls[0] 
                        : 'https://via.placeholder.com/300x200?text=No+Image'} 
                      alt={vehicle.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="favorite-content">
                    <h3 className="favorite-title">{vehicle.title}</h3>
                    <div className="favorite-details">
                      <p className="favorite-price">{formatPrice(vehicle.price)}</p>
                      <p className="favorite-vehicle">
                        {vehicle.vehicle.year} {vehicle.vehicle.brand} {vehicle.vehicle.model}
                      </p>
                      <p className="favorite-specs">
                        <span>{vehicle.vehicle.mileage.toLocaleString()} miles</span>
                        <span> • {vehicle.vehicle.fuelType}</span>
                        <span> • {vehicle.vehicle.transmissionType}</span>
                      </p>
                      <p className="favorite-location">{vehicle.location}</p>
                    </div>
                    
                    <div className="favorite-actions">
                      <Link to={`/vehicle/${vehicle.id}`} className="btn view-btn">View Details</Link>
                      <button 
                        className="btn remove-btn"
                        onClick={() => handleRemoveFromFavorites(vehicle.id)}
                      >
                        Remove from Favorites
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="favorites-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Favorites;