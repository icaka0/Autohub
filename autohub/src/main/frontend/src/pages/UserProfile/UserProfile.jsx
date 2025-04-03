import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.scss';
import { checkAuthStatus, logoutUser, getUserVehicleAds, updateVehicleAdStatus, getVehicleAd } from '../../services/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userAds, setUserAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await checkAuthStatus();
        if (!userData) {
          // Not authenticated, redirect to login
          navigate('/login');
          return;
        }
        
        setUser(userData);
        
        // Also fetch user's vehicle ads
        const ads = await getUserVehicleAds();
        setUserAds(ads || []);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
    }
  };
  
  const handleRenewAd = async (adId) => {
    try {
      await updateVehicleAdStatus(adId, 'ACTIVE');
      // Refresh the ads after renewal
      const refreshedAds = await getUserVehicleAds();
      setUserAds(refreshedAds || []);
    } catch (err) {
      console.error('Error renewing ad:', err);
      setError('Failed to renew ad. Please try again.');
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
  
  const getExpirationInfo = (ad) => {
    if (ad.status !== 'ACTIVE') {
      return null;
    }

    // Calculate when the ad will expire - 2 minutes after last update
    const lastUpdated = new Date(ad.updatedAt || ad.createdAt);
    const expirationTime = new Date(lastUpdated.getTime() + (2 * 60 * 1000)); // 2 minutes in milliseconds
    
    return { 
      time: expirationTime,
      formattedTime: expirationTime.toLocaleString()
    };
  };
  
  if (loading) {
    return <div className="profile-loading">Loading profile...</div>;
  }
  
  if (error) {
    return <div className="profile-error">{error}</div>;
  }
  
  if (!user) {
    return (
      <div className="profile-not-authenticated">
        <p>You must be logged in to view this page.</p>
        <Link to="/login" className="btn login-btn">Login</Link>
      </div>
    );
  }
  
  return (
    <div className="user-profile">
      <header className="profile-header">
        <div className="logo-container">
          <Link to="/">
            <h1 className="logo">AutoHub</h1>
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/browse" className="btn browse-btn">Browse Vehicles</Link>
          <Link to="/favorites" className="btn favorites-btn">My Favorites</Link>
          <Link to="/my-ads" className="btn my-ads-btn">My Listings</Link>
          {user && user.role === 'ADMIN' && (
            <Link to="/admin" className="btn admin-btn">Admin Panel</Link>
          )}
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="profile-content">
        <div className="profile-card">
          <h1>My Profile</h1>
          
          <div className="profile-info">
            <div className="info-group">
              <h3>Personal Information</h3>
              <div className="info-item">
                <span className="label">Username:</span>
                <span className="value">{user.username}</span>
              </div>
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{user.firstName} {user.lastName}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{user.phoneNumber}</span>
              </div>
            </div>
            
            <div className="info-group">
              <h3>Account Information</h3>
              <div className="info-item">
                <span className="label">Role:</span>
                <span className="value">{user.role}</span>
              </div>
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{user.id}</span>
              </div>
            </div>
          </div>
          
          <div className="profile-actions">
            <Link to="/my-ads" className="btn view-listings-btn">My Listings</Link>
            <Link to="/favorites" className="btn favorites-btn">My Favorites</Link>
            <Link to="/create-ad" className="btn create-listing-btn">Create Listing</Link>
          </div>
          
          <div className="vehicle-listings">
            <h3>My Vehicle Listings</h3>
            {userAds.length === 0 ? (
              <div className="listings-placeholder">
                <p>You don't have any vehicle listings yet.</p>
                <Link to="/create-ad" className="btn create-listing-btn">Create Listing</Link>
              </div>
            ) : (
              <div className="listings-grid">
                {userAds.map(ad => (
                  <div key={ad.id} className="listing-card">
                    <div className="listing-image">
                      <img 
                        src={ad.imageUrls && ad.imageUrls.length > 0 
                          ? ad.imageUrls[0] 
                          : 'https://via.placeholder.com/200x150?text=No+Image'} 
                        alt={ad.title} 
                      />
                    </div>
                    <div className="listing-details">
                      <h4>{ad.title}</h4>
                      <p className="listing-vehicle">{ad.vehicle.year} {ad.vehicle.brand} {ad.vehicle.model}</p>
                      <p className="listing-price">{formatPrice(ad.price)}</p>
                      <p className="listing-status">Status: <span className={ad.status.toLowerCase()}>{ad.status}</span></p>
                      {ad.status === 'ACTIVE' && getExpirationInfo(ad) && (
                        <p className="listing-expiration">
                          Expires: {getExpirationInfo(ad).formattedTime}
                        </p>
                      )}
                      {ad.status === 'EXPIRED' && (
                        <button 
                          className="btn renew-btn"
                          onClick={() => handleRenewAd(ad.id)}
                        >
                          Renew Ad
                        </button>
                      )}
                    </div>
                    <div className="listing-actions">
                      <Link to={`/vehicle/${ad.id}`} className="btn view-btn">View</Link>
                      <Link to={`/edit-ad/${ad.id}`} className="btn edit-btn">Edit</Link>
                    </div>
                  </div>
                ))}
                <div className="more-listings">
                  <Link to="/my-ads" className="btn view-all-btn">View All My Listings</Link>
                  <Link to="/create-ad" className="btn create-btn">Create New Listing</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="profile-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserProfile;
