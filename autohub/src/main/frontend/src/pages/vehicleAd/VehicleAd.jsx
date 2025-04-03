import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVehicleAdById, checkAuthStatus, logoutUser, deleteVehicleAd } from '../../services/api';
import './VehicleAd.scss';

const VehicleAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get the vehicle ad data
        const adData = await getVehicleAdById(id);
        setAd(adData);
        
        // Check authentication status properly
        try {
          const userData = await checkAuthStatus();
          setCurrentUser(userData);
        } catch (authError) {
          // If auth check fails, set currentUser to null (not logged in)
          console.error('Auth check failed:', authError);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error fetching ad data:', error);
        setError('Failed to load the vehicle ad. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only handle keys if we have multiple images
      if (ad?.imageUrls?.length > 1) {
        if (e.key === 'ArrowLeft') {
          // Navigate to previous image
          setActiveImage(prev => prev === 0 ? ad.imageUrls.length - 1 : prev - 1);
        } else if (e.key === 'ArrowRight') {
          // Navigate to next image
          setActiveImage(prev => prev === ad.imageUrls.length - 1 ? 0 : prev + 1);
        }
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyPress);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ad]);
  
  const handleContactSeller = () => {
    if (ad && ad.contactPhone) {
      alert(`Contact ${ad.seller.firstName} ${ad.seller.lastName} at ${ad.contactPhone}`);
    } else {
      alert('Contact information not available');
    }
  };
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await deleteVehicleAd(id);
        navigate('/my-ads');
      } catch (error) {
        console.error('Error deleting ad:', error);
        setError('Failed to delete the ad. Please try again.');
      }
    } else {
      setConfirmDelete(true);
    }
  };
  
  const formatPrice = (price) => {
    return `€${parseInt(price).toLocaleString()}`;
  };
  
  const isOwner = currentUser && ad && ad.seller && currentUser.id === ad.seller.id;
  const isLoggedIn = currentUser !== null;
  
  const closeLightbox = useCallback((e) => {
    if (e.key === 'Escape') {
      setLightboxOpen(false);
    }
  }, []);
  
  useEffect(() => {
    if (lightboxOpen) {
      document.addEventListener('keydown', closeLightbox);
      // Lock body scroll when lightbox is open
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', closeLightbox);
      // Restore scroll when lightbox is closed
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.removeEventListener('keydown', closeLightbox);
      document.body.style.overflow = 'auto';
    };
  }, [lightboxOpen, closeLightbox]);
  
  if (loading) return <div className="loading">Loading vehicle details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!ad) return <div className="error">Vehicle ad not found</div>;
  
  return (
    <div className="vehicle-ad-page">
      <header className="ad-header">
        <div className="logo-container">
          <Link to="/" className="logo">AutoHub</Link>
        </div>
        <div className="nav-buttons">
          <Link to="/browse" className="btn browse-btn">Browse</Link>
          {currentUser ? (
            <>
              <Link to="/my-ads" className="btn my-ads-btn">My Ads</Link>
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
      
      <div className="ad-main">
        <div className="ad-container">
          <div className="ad-title">
            <h2>{ad.title}</h2>
            <div className="ad-subtitle">{ad.vehicle.year} {ad.vehicle.brand} {ad.vehicle.model}</div>
          </div>
          
          <div className="ad-content">
            <div className="vehicle-images">
              <div className="main-image-container">
                <img 
                  src={ad.imageUrls && ad.imageUrls[activeImage] || '/images/no-image.png'} 
                  alt={`${ad.title} - Image ${activeImage + 1} of ${ad.imageUrls?.length || 1}`}
                  className="carousel-image"
                  onClick={() => ad.imageUrls && ad.imageUrls.length > 0 && setLightboxOpen(true)}
                  style={{ cursor: ad.imageUrls && ad.imageUrls.length > 0 ? 'pointer' : 'default' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/800x600?text=No+Image+Available';
                  }}
                />
                
                {ad.imageUrls && ad.imageUrls.length > 1 && (
                  <>
                    <button 
                      className="image-nav prev" 
                      onClick={() => setActiveImage(prev => prev === 0 ? ad.imageUrls.length - 1 : prev - 1)}
                      aria-label="Previous image"
                    >
                      <span className="arrow">‹</span>
                    </button>
                    <button 
                      className="image-nav next" 
                      onClick={() => setActiveImage(prev => prev === ad.imageUrls.length - 1 ? 0 : prev + 1)}
                      aria-label="Next image"
                    >
                      <span className="arrow">›</span>
                    </button>
                    <div className="image-counter">
                      {activeImage + 1} / {ad.imageUrls.length}
                    </div>
                  </>
                )}
              </div>
              
              {ad.imageUrls && ad.imageUrls.length > 1 && (
                <div className="thumbnail-strip">
                  {ad.imageUrls.map((url, index) => (
                    <div 
                      key={index} 
                      className={`thumbnail ${index === activeImage ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img 
                        src={url} 
                        alt={`Thumbnail ${index + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/150x100?text=Error';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="ad-details">
              <div className="vehicle-info-main">
                <div className="price-section">
                  <div className="price-label">Price</div>
                  <div className="price-value">{formatPrice(ad.price)}</div>
                </div>
                
                <div className="specs-table">
                  <h3>Vehicle Specifications</h3>
                  <div className="table-container">
                    <table>
                      <tbody>
                        <tr>
                          <th>Brand</th>
                          <td>{ad.vehicle.brand}</td>
                          <th>Model</th>
                          <td>{ad.vehicle.model}</td>
                        </tr>
                        <tr>
                          <th>Year</th>
                          <td>{ad.vehicle.year}</td>
                          <th>Mileage</th>
                          <td>{ad.vehicle.mileage.toLocaleString()} km</td>
                        </tr>
                        <tr>
                          <th>Fuel Type</th>
                          <td>{ad.vehicle.fuelType}</td>
                          <th>Transmission</th>
                          <td>{ad.vehicle.transmissionType}</td>
                        </tr>
                        <tr>
                          <th>Vehicle Type</th>
                          <td>{ad.vehicle.vehicleType}</td>
                          <th>Horse Power</th>
                          <td>{ad.vehicle.horsePower} hp</td>
                        </tr>
                        {ad.vehicle.color && (
                          <tr>
                            <th>Color</th>
                            <td colSpan="3">{ad.vehicle.color}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {ad.description && (
                  <div className="description-section">
                    <h3>Description</h3>
                    <div className="description-content">
                      {ad.description}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="seller-section">
                <div className="contact-box">
                  <h3>Seller Information</h3>
                  <div className="seller-name">{ad.seller.firstName} {ad.seller.lastName}</div>
                  <div className="contact-phone">
                    <span className="label">Phone:</span>
                    <span className="value">{ad.contactPhone || 'Not provided'}</span>
                  </div>
                  <div className="location">
                    <span className="label">Location:</span>
                    <span className="value">{ad.location}</span>
                  </div>
                  
                  {isLoggedIn && !isOwner ? (
                    <button className="contact-button" onClick={handleContactSeller}>
                      Contact Seller
                    </button>
                  ) : !isLoggedIn ? (
                    <div className="login-to-contact">
                      <p>Please log in to contact the seller</p>
                      <div className="auth-buttons">
                        <Link to="/login" className="login-button">Log In</Link>
                        <Link to="/register" className="register-button">Register</Link>
                      </div>
                    </div>
                  ) : null}
                  
                  {isOwner && (
                    <div className="owner-actions">
                      <Link to={`/edit-ad/${id}`} className="edit-button">Edit Ad</Link>
                      <button 
                        className="delete-button"
                        onClick={handleDelete}
                      >
                        {confirmDelete ? 'Confirm Delete' : 'Delete Ad'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {lightboxOpen && ad.imageUrls && ad.imageUrls.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={ad.imageUrls[activeImage]} 
              alt={`${ad.title} - Fullscreen view`}
              className="lightbox-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/1200x800?text=No+Image+Available';
              }}
            />
            <button 
              className="lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen view"
            >
              ×
            </button>
            {ad.imageUrls.length > 1 && (
              <>
                <button 
                  className="lightbox-nav prev" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => prev === 0 ? ad.imageUrls.length - 1 : prev - 1);
                  }}
                  aria-label="Previous image"
                >
                  <span className="arrow">‹</span>
                </button>
                <button 
                  className="lightbox-nav next" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImage(prev => prev === ad.imageUrls.length - 1 ? 0 : prev + 1);
                  }}
                  aria-label="Next image"
                >
                  <span className="arrow">›</span>
                </button>
                <div className="lightbox-counter">
                  {activeImage + 1} / {ad.imageUrls.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleAd;
