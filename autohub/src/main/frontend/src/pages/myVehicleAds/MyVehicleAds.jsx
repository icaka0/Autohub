import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyVehicleAds.scss';
import { checkAuthStatus, getUserVehicleAds, updateVehicleAdStatus, deleteVehicleAd, logoutUser } from '../../services/api';

const MyVehicleAds = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [vehicleAds, setVehicleAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check authentication and fetch user ads
  useEffect(() => {
    const init = async () => {
      try {
        // Check if user is authenticated
        const userData = await checkAuthStatus();
        if (!userData) {
          navigate('/login');
          return;
        }
        setCurrentUser(userData);
        
        // Fetch user's vehicle ads
        console.log('Fetching vehicle ads for user:', userData.id);
        const ads = await getUserVehicleAds();
        console.log('Fetched vehicle ads:', ads);
        setVehicleAds(ads || []);
      } catch (error) {
        console.error('Error in MyVehicleAds:', error);
        setError(error.message || 'Failed to load your vehicle ads');
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
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleStatusToggle = async (adId, currentStatus) => {
    try {
      // Toggle between ACTIVE and INACTIVE
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      const updatedAd = await updateVehicleAdStatus(adId, newStatus);
      
      // Update the ads list
      setVehicleAds(prev => 
        prev.map(ad => ad.id === adId ? updatedAd : ad)
      );
    } catch (error) {
      console.error('Error updating ad status:', error);
      setError('Failed to update ad status. Please try again.');
    }
  };
  
  const handleDeleteAd = async (adId) => {
    if (!window.confirm('Are you sure you want to delete this ad? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteVehicleAd(adId);
      
      // Remove the ad from the list
      setVehicleAds(prev => prev.filter(ad => ad.id !== adId));
    } catch (error) {
      console.error('Error deleting ad:', error);
      setError('Failed to delete ad. Please try again.');
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
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="my-vehicle-ads">
        <header className="ads-header">
          <div className="logo-container">
            <Link to="/" className="logo">AutoHub</Link>
          </div>
        </header>
        <main className="ads-main">
          <div className="ads-container">
            <div className="loading-message">Loading your vehicle ads...</div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="my-vehicle-ads">
      <header className="ads-header">
        <div className="logo-container">
          <Link to="/" className="logo">AutoHub</Link>
        </div>
        <div className="header-actions">
          <Link to="/browse" className="btn browse-btn">Browse Vehicles</Link>
          <Link to="/profile" className="btn profile-btn">Profile</Link>
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="ads-main">
        <div className="page-title">
          <h1>My Vehicle Ads</h1>
          <Link to="/create-ad" className="btn create-ad-btn">Create New Ad</Link>
        </div>
        
        <div className="ads-container">
          {error && <div className="error-message">{error}</div>}
          
          {vehicleAds.length === 0 ? (
            <div className="no-ads-message">
              <p>You don't have any vehicle listings yet.</p>
              <Link to="/create-ad" className="btn create-ad-btn">Create Your First Ad</Link>
            </div>
          ) : (
            <div className="ads-list">
              {vehicleAds.map(ad => (
                <div key={ad.id} className="ad-card">
                  <div className="ad-image">
                    <img 
                      src={ad.imageUrls && ad.imageUrls.length > 0 
                        ? ad.imageUrls[0] 
                        : 'https://via.placeholder.com/200x150?text=No+Image'} 
                      alt={ad.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                      }}
                    />
                  </div>
                  
                  <div className="ad-details">
                    <h3 className="ad-title">{ad.title}</h3>
                    <div className="vehicle-info">
                      <span>{ad.vehicle.year} {ad.vehicle.brand} {ad.vehicle.model}</span>
                      <span> • {ad.vehicle.mileage.toLocaleString()} miles</span>
                      <span> • {ad.vehicle.fuelType}</span>
                      <span> • {ad.vehicle.transmissionType}</span>
                    </div>
                    
                    <div className="ad-price">{formatPrice(ad.price)}</div>
                    
                    <div className="ad-meta">
                      <span className={`status-badge ${ad.status.toLowerCase()}`}>
                        {ad.status}
                      </span>
                      <span className="views">
                        <i className="fa fa-eye"></i> {ad.viewCount || 0} views
                      </span>
                      <span className="date">
                        <i className="fa fa-calendar"></i> {formatDate(ad.createdAt)}
                      </span>
                    </div>
                    
                    <div className="ad-location">
                      <i className="fa fa-map-marker"></i> {ad.location}
                    </div>
                  </div>
                  
                  <div className="ad-actions">
                    <Link to={`/vehicle/${ad.id}`} className="btn view-btn">View Ad</Link>
                    <Link to={`/edit-ad/${ad.id}`} className="btn edit-btn">Edit Ad</Link>
                    <button 
                      className={`btn status-toggle-btn ${ad.status.toLowerCase()}`}
                      onClick={() => handleStatusToggle(ad.id, ad.status)}
                    >
                      {ad.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      className="btn delete-btn"
                      onClick={() => handleDeleteAd(ad.id)}
                    >
                      Delete Ad
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="ads-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyVehicleAds;
