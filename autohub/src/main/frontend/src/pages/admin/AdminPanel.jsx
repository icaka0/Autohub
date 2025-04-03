import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkAuthStatus, logoutUser } from '../../services/api';
import './AdminPanel.scss';
import AdminUserManagement from './AdminUserManagement';

const AdminPanel = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        if (!userData || userData.role !== 'ADMIN') {
          // If not admin, redirect to home
          navigate('/');
          return;
        }
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <div className="logo-container">
          <Link to="/">
            <h1 className="logo">AutoHub</h1>
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/profile" className="btn profile-btn">Profile</Link>
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="admin-main">
        <div className="container">
          <h1 className="admin-title">Admin Panel</h1>
          
          <div className="admin-nav">
            <button className="admin-nav-item active">User Management</button>
            {/* Add more admin navigation items if needed */}
          </div>
          
          <div className="admin-content">
            <AdminUserManagement />
          </div>
        </div>
      </main>
      
      <footer className="admin-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminPanel;