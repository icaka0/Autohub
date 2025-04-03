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
  
  const handleStatusToggle = async (ad) => {
    try {
      let newStatus;
      
      // Determine the new status based on current status
      if (ad.status === 'ACTIVE') {
        newStatus = 'EXPIRED';
      } else if (ad.status === 'EXPIRED' || ad.status === 'DEACTIVATED') {
        newStatus = 'ACTIVE';
      } else {
        console.error(`Cannot toggle status from ${ad.status}`);
        setError(`Cannot change status from ${ad.status}`);
        return;
      }
      
      console.log(`Changing status from ${ad.status} to ${newStatus} for ad ${ad.id}`);
      
      // Show loading state while updating
      setError(null);
      setLoading(true);
      
      // Call the API
      await updateVehicleAdStatus(ad.id, newStatus);
      
      // Refresh the ads list
      await fetchUserAds();
      
      console.log('Status updated successfully');
    } catch (err) {
      console.error('Error updating ad status:', err);
      setError(`Failed to update status: ${err.message}`);
    } finally {
      setLoading(false);
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
  
  // Add this function to calculate and show time remaining until expiration
  const getExpirationInfo = (ad) => {
    if (ad.status !== 'ACTIVE') {
      return null;
    }

    // Calculate when the ad will expire - 2 minutes after last update
    const lastUpdated = new Date(ad.updatedAt || ad.createdAt);
    const expirationTime = new Date(lastUpdated.getTime() + (2 * 60 * 1000)); // 2 minutes in milliseconds
    const now = new Date();
    
    // If already expired (shouldn't happen, but just in case)
    if (expirationTime <= now) {
      return { expired: true, message: 'Expired' };
    }
    
    // Calculate minutes and seconds remaining
    const msRemaining = expirationTime - now;
    const minutesRemaining = Math.floor(msRemaining / 60000);
    const secondsRemaining = Math.floor((msRemaining % 60000) / 1000);
    
    return { 
      expired: false, 
      message: `Expires in: ${minutesRemaining}m ${secondsRemaining}s` 
    };
  };
  
  // Add this function to handle renewing an ad
  const handleRenewAd = async (adId) => {
    try {
      await updateVehicleAdStatus(adId, 'ACTIVE');
      // Refresh the list of ads after updating
      fetchUserAds();
    } catch (err) {
      console.error('Error renewing ad:', err);
      setError('Failed to renew ad. Please try again.');
    }
  };
  
  // Add this function to the MyVehicleAds component
  const fetchUserAds = async () => {
    try {
      setLoading(true);
      const ads = await getUserVehicleAds();
      setVehicleAds(ads || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching user ads:', error);
      setError('Failed to refresh ads. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <div className="nav-buttons">
          <Link to="/browse" className="btn browse-btn">Browse</Link>
          <Link to="/profile" className="btn profile-btn">Profile</Link>
          <Link to="/favorites" className="btn favorites-btn">My Favorites</Link>
          <Link to="/create-ad" className="btn create-ad-btn">Create Ad</Link>
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
                      onClick={() => handleStatusToggle(ad)}
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
