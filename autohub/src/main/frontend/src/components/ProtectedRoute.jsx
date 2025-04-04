import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useNavigate } from 'react-router-dom';
import { checkAuthStatus, getVehicleAd } from '../services/api';

// Component to protect routes that require authentication
export const AuthProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        setAuthenticated(true);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Component to protect routes that require ownership of a resource
export const OwnerProtectedRoute = ({ children }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      try {
        // First check if user is authenticated
        const userData = await checkAuthStatus();
        
        // Then check if they own the ad
        const adData = await getVehicleAd(id);
        
        // Check if current user is the owner
        if (userData.id === adData.seller.id) {
          setIsOwner(true);
        } else {
          console.log('User is not the owner of this ad');
          setIsOwner(false);
        }
      } catch (error) {
        console.error('Authorization check failed:', error);
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    };

    checkOwnership();
  }, [id]);

  if (loading) {
    return <div className="loading">Checking authorization...</div>;
  }

  if (!isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        setCurrentUser(userData);
        
        if (!userData || userData.role !== 'ADMIN') {
          navigate('/');
          return;
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminAuth();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return currentUser && currentUser.role === 'ADMIN' ? children : null;
}; 