import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './EditVehicleAd.scss';
import { getVehicleAd, updateVehicleAd, checkAuthStatus, logoutUser } from '../../services/api';

const EditVehicleAd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [originalAd, setOriginalAd] = useState(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    contactPhone: '',
    brand: '',
    model: '',
    year: '',
    fuelType: '',
    transmissionType: '',
    vehicleType: '',
    mileage: '',
    horsePower: '',
    color: '',
    imageUrls: []
  });
  
  // Images state
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if user is logged in
        const userData = await checkAuthStatus();
        setCurrentUser(userData);
        
        // Fetch the ad details
        const adData = await getVehicleAd(id);
        setOriginalAd(adData);
        
        // Check if the current user is the owner of the ad
        if (!userData || userData.id !== adData.seller.id) {
          setError('You do not have permission to edit this ad');
          // Redirect after a short delay
          setTimeout(() => navigate('/'), 2000);
          return;
        }
        
        // Populate form with existing data
        setFormData({
          title: adData.title || '',
          description: adData.description || '',
          price: adData.price || '',
          location: adData.location || '',
          contactPhone: adData.contactPhone || adData.seller.phoneNumber || '',
          brand: adData.vehicle.brand || '',
          model: adData.vehicle.model || '',
          year: adData.vehicle.year || '',
          fuelType: adData.vehicle.fuelType || '',
          transmissionType: adData.vehicle.transmissionType || '',
          vehicleType: adData.vehicle.vehicleType || '',
          mileage: adData.vehicle.mileage || '',
          horsePower: adData.vehicle.horsePower || '',
          color: adData.vehicle.color || '',
          imageUrls: adData.imageUrls || []
        });
        
        // Load existing images
        if (adData.imageUrls && adData.imageUrls.length > 0) {
          setImages(adData.imageUrls.map(url => ({ url })));
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load ad details. Please try again later.');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check if adding these files would exceed the limit
    const currentImagesCount = formData.imageUrls ? formData.imageUrls.length : 0;
    if (currentImagesCount + files.length > 15) {
      setError(`You can only upload a maximum of 15 images. You already have ${currentImagesCount} image(s).`);
      return;
    }
    
    // Process files to get previews
    Promise.all(
      files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              file,
              preview: e.target.result
            });
          };
          reader.readAsDataURL(file);
        });
      })
    ).then(imageFiles => {
      // Add new images to existing ones
      setImageFiles(prev => [...prev, ...imageFiles]);
      setImages(prev => [...prev, ...imageFiles.map(img => ({ url: img.preview }))]);
    });
  };
  
  const removeImage = (index) => {
    // Create a copy of the current images array without the selected image
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    
    // Also update the formData.imageUrls to keep them in sync
    const updatedUrls = [...formData.imageUrls];
    updatedUrls.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      imageUrls: updatedUrls
    }));
    
    // If it was a newly added image (not from original ad), remove from imageFiles as well
    if (imageFiles.length > 0) {
      const updatedImageFiles = [...imageFiles];
      // Only remove if index is within range of imageFiles
      if (index < imageFiles.length) {
        updatedImageFiles.splice(index, 1);
        setImageFiles(updatedImageFiles);
      }
    }
  };
  
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    
    // Vehicle fields validation
    if (!formData.brand) {
      errors.brand = 'Brand is required';
      isValid = false;
    }
    
    if (!formData.model) {
      errors.model = 'Model is required';
      isValid = false;
    }
    
    if (!formData.year) {
      errors.year = 'Year is required';
      isValid = false;
    } else if (formData.year < 1900 || formData.year > 2100) {
      errors.year = 'Year must be between 1900 and 2100';
      isValid = false;
    }
    
    if (!formData.fuelType) {
      errors.fuelType = 'Fuel type is required';
      isValid = false;
    }
    
    if (!formData.transmissionType) {
      errors.transmissionType = 'Transmission type is required';
      isValid = false;
    }
    
    if (!formData.vehicleType) {
      errors.vehicleType = 'Vehicle type is required';
      isValid = false;
    }
    
    if (!formData.mileage) {
      errors.mileage = 'Mileage is required';
      isValid = false;
    } else if (formData.mileage < 0) {
      errors.mileage = 'Mileage cannot be negative';
      isValid = false;
    }
    
    if (!formData.horsePower) {
      errors.horsePower = 'Horse power is required';
      isValid = false;
    } else if (formData.horsePower < 1) {
      errors.horsePower = 'Horse power must be at least 1';
      isValid = false;
    }
    
    // Ad fields validation
    if (!formData.title) {
      errors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length < 5 || formData.title.length > 100) {
      errors.title = 'Title must be between 5 and 100 characters';
      isValid = false;
    }
    
    if (formData.description && formData.description.length > 2000) {
      errors.description = 'Description cannot exceed 2000 characters';
      isValid = false;
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
      isValid = false;
    } else if (parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than zero';
      isValid = false;
    }
    
    if (!formData.location) {
      errors.location = 'Location is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create updated ad object with proper mutable collections
      const updatePayload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        contactPhone: formData.contactPhone,
        vehicle: {
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          fuelType: formData.fuelType,
          transmissionType: formData.transmissionType,
          vehicleType: formData.vehicleType,
          mileage: parseInt(formData.mileage),
          horsePower: parseInt(formData.horsePower),
          color: formData.color
        },
        // Create a new mutable array for image URLs
        imageUrls: []
      };
      
      // Add existing images that weren't removed
      if (formData.imageUrls && formData.imageUrls.length > 0) {
        // Create a new array to ensure mutability
        updatePayload.imageUrls = [...formData.imageUrls]; 
      }
      
      // Add any new images
      if (imageFiles && imageFiles.length > 0) {
        const newImageUrls = imageFiles.map(img => img.preview);
        updatePayload.imageUrls = [...updatePayload.imageUrls, ...newImageUrls];
      }
      
      // Update the ad
      await updateVehicleAd(id, updatePayload);
      navigate(`/vehicle/${id}`);
    } catch (err) {
      console.error('Error updating ad:', err);
      setError('Failed to update the ad. Please try again.');
    } finally {
      setSubmitting(false);
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
  
  if (loading) {
    return (
      <div className="create-ad-page">
        <header className="create-ad-header">
          <div className="logo-container">
            <Link to="/">
              <h1 className="logo">AutoHub</h1>
            </Link>
          </div>
          <div className="loading">Loading...</div>
        </header>
        <div className="loading-container">Loading ad details...</div>
      </div>
    );
  }
  
  return (
    <div className="create-ad-page">
      <header className="create-ad-header">
        <div className="logo-container">
          <Link to="/">
            <h1 className="logo">AutoHub</h1>
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/browse" className="btn browse-btn">Browse Vehicles</Link>
          {currentUser ? (
            <>
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
      
      <main className="create-ad-main">
        <div className="form-container">
          <h1>Edit Vehicle Ad</h1>
          
          {error && <div className="form-error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Vehicle Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brand">Brand*</label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={formErrors.brand ? 'error' : ''}
                  />
                  {formErrors.brand && <span className="field-error">{formErrors.brand}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="model">Model*</label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className={formErrors.model ? 'error' : ''}
                  />
                  {formErrors.model && <span className="field-error">{formErrors.model}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="year">Year*</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={formErrors.year ? 'error' : ''}
                  />
                  {formErrors.year && <span className="field-error">{formErrors.year}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="fuelType">Fuel Type*</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleInputChange}
                    className={formErrors.fuelType ? 'error' : ''}
                  >
                    <option value="">Select Fuel Type</option>
                    <option value="PETROL">Petrol</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                  </select>
                  {formErrors.fuelType && <span className="field-error">{formErrors.fuelType}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="transmissionType">Transmission*</label>
                  <select
                    id="transmissionType"
                    name="transmissionType"
                    value={formData.transmissionType}
                    onChange={handleInputChange}
                    className={formErrors.transmissionType ? 'error' : ''}
                  >
                    <option value="">Select Transmission</option>
                    <option value="MANUAL">Manual</option>
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="SEMI_AUTOMATIC">Semi-Automatic</option>
                  </select>
                  {formErrors.transmissionType && <span className="field-error">{formErrors.transmissionType}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="vehicleType">Vehicle Type*</label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className={formErrors.vehicleType ? 'error' : ''}
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="HATCHBACK">Hatchback</option>
                    <option value="COUPE">Coupe</option>
                    <option value="CONVERTIBLE">Convertible</option>
                    <option value="WAGON">Wagon</option>
                    <option value="VAN">Van</option>
                    <option value="TRUCK">Truck</option>
                  </select>
                  {formErrors.vehicleType && <span className="field-error">{formErrors.vehicleType}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="mileage">Mileage (km)*</label>
                  <input
                    type="number"
                    id="mileage"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className={formErrors.mileage ? 'error' : ''}
                  />
                  {formErrors.mileage && <span className="field-error">{formErrors.mileage}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="horsePower">Horse Power*</label>
                  <input
                    type="number"
                    id="horsePower"
                    name="horsePower"
                    value={formData.horsePower}
                    onChange={handleInputChange}
                    className={formErrors.horsePower ? 'error' : ''}
                  />
                  {formErrors.horsePower && <span className="field-error">{formErrors.horsePower}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="color">Color (optional)</label>
                  <input
                    type="text"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Ad Details</h2>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="title">Title*</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={formErrors.title ? 'error' : ''}
                    placeholder="E.g., 2021 BMW 3 Series - Low Mileage, Excellent Condition"
                  />
                  {formErrors.title && <span className="field-error">{formErrors.title}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={formErrors.description ? 'error' : ''}
                    rows="5"
                    placeholder="Provide details about the vehicle's condition, history, features, etc."
                  ></textarea>
                  {formErrors.description && <span className="field-error">{formErrors.description}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price (€)*</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={formErrors.price ? 'error' : ''}
                    placeholder="Enter amount in EUR"
                  />
                  {formErrors.price && <span className="field-error">{formErrors.price}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location*</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={formErrors.location ? 'error' : ''}
                    placeholder="E.g., Sofia, Bulgaria"
                  />
                  {formErrors.location && <span className="field-error">{formErrors.location}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone (optional)</label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="Your contact phone number"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label>Images</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                    />
                    <label htmlFor="images" className="image-upload-button">
                      <i className="fas fa-cloud-upload-alt"></i> Add Photos
                    </label>
                    <small className="upload-limit-note">Maximum 15 images allowed. Current: {formData.imageUrls ? formData.imageUrls.length : 0}/15</small>
                    
                    <div className="image-preview-container">
                      {images.map((image, index) => (
                        <div key={index} className="image-preview">
                          <img src={image.url} alt={`Preview ${index + 1}`} />
                          <button 
                            type="button" 
                            className="remove-image"
                            onClick={() => removeImage(index)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Ad'}
              </button>
              <Link 
                to={`/vehicle/${id}`} 
                className="btn cancel-btn"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
      
      <footer className="create-ad-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default EditVehicleAd; 