import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './UserProfile.scss';
import { checkAuthStatus, logoutUser } from '../../services/api';

const UserProfile = () => {
  const [user, setUser] = useState(null);
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
          <Link to="/" className="logo">AutoHub</Link>
        </div>
        <div className="header-actions">
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
            <button className="btn edit-btn">Edit Profile</button>
            <button className="btn change-password-btn">Change Password</button>
          </div>
          
          <div className="vehicle-listings">
            <h3>My Vehicle Listings</h3>
            <div className="listings-placeholder">
              <p>You don't have any vehicle listings yet.</p>
              <Link to="/create-listing" className="btn create-listing-btn">Create Listing</Link>
            </div>
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
