import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CreateVehicleAd.scss';
import { checkAuthStatus, logoutUser, createVehicleAd, compressImage } from '../../services/api';

const CreateVehicleAd = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    // Vehicle details
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    fuelType: '',
    transmissionType: '',
    vehicleType: '',
    mileage: '',
    horsePower: '',
    color: '',
    
    // Ad details
    title: '',
    description: '',
    price: '',
    location: '',
    contactPhone: '',
    imageUrls: []
  });
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await checkAuthStatus();
        if (!userData) {
          // Redirect to login if not authenticated
          navigate('/login');
          return;
        }
        setCurrentUser(userData);
        // Pre-fill contact phone with user's phone if available
        if (userData.phoneNumber) {
          setFormData(prev => ({
            ...prev,
            contactPhone: userData.phoneNumber
          }));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Calculate how many more images we can add
    const remainingSlots = 8 - formData.imageUrls.length;
    
    if (remainingSlots <= 0) {
      setError("Maximum of 8 images allowed. Please remove some images first.");
      return;
    }
    
    // Only take as many files as we have slots for
    const filesToProcess = files.slice(0, remainingSlots);
    
    try {
      setSubmitting(true);
      
      // Process all files
      const compressedImages = await Promise.all(
        filesToProcess.map(file => compressImage(file))
      );
      
      // Add new images to existing ones
      setFormData(prev => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ...compressedImages]
      }));
    } catch (error) {
      console.error('Error processing images:', error);
      setError('Failed to process images. Please try smaller images.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const removeImage = (index) => {
    // Make a copy of the images array and remove the selected image
    const updatedImageUrls = [...formData.imageUrls];
    updatedImageUrls.splice(index, 1);
    
    // Update the form data
    setFormData(prev => ({
      ...prev,
      imageUrls: updatedImageUrls
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'brand', 'model', 'year', 'fuelType', 'transmissionType', 
      'vehicleType', 'mileage', 'horsePower', 'title', 'price', 'location'
    ];
    
    // Check required fields
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });
    
    // Numeric validation
    if (formData.mileage && isNaN(Number(formData.mileage))) {
      errors.mileage = 'Mileage must be a number';
    }
    
    if (formData.horsePower && isNaN(Number(formData.horsePower))) {
      errors.horsePower = 'Horse power must be a number';
    }
    
    if (formData.price && isNaN(Number(formData.price))) {
      errors.price = 'Price must be a number';
    }
    
    // Year validation
    const currentYear = new Date().getFullYear();
    if (formData.year && (formData.year < 1900 || formData.year > currentYear + 1)) {
      errors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }
    
    // Image validation
    if (formData.imageUrls.length === 0) {
      errors.imageUrls = 'Please upload at least one image';
    }
    
    setFormErrors(errors);
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFormErrors({});
    
    // Validate form data
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setSubmitting(false);
      return;
    }
    
    try {
      // Verify all required fields are present with console logs
      console.log('Vehicle brand:', formData.brand);
      console.log('Vehicle model:', formData.model);
      console.log('Vehicle year:', formData.year);
      console.log('Vehicle fuelType:', formData.fuelType);
      console.log('Vehicle transmissionType:', formData.transmissionType);
      console.log('Vehicle vehicleType:', formData.vehicleType);
      
      // Format the data for the API
      const vehicleAdData = {
        vehicle: {
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year, 10),
          fuelType: formData.fuelType.toUpperCase(),
          transmissionType: formData.transmissionType.toUpperCase(),
          vehicleType: formData.vehicleType.toUpperCase(),
          mileage: parseInt(formData.mileage, 10),
          horsePower: parseInt(formData.horsePower, 10),
          color: formData.color
        },
        title: formData.title,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : 0,
        imageUrls: formData.imageUrls,
        location: formData.location,
        contactPhone: formData.contactPhone
      };
      
      console.log('Submitting vehicle ad data:', vehicleAdData);
      
      // Send the data to the API
      const createdAd = await createVehicleAd(vehicleAdData);
      console.log('Created ad:', createdAd);
      
      // Redirect to the my ads page
      navigate('/my-ads');
    } catch (error) {
      console.error('Error creating vehicle ad:', error);
      setError(error.message || 'Failed to create vehicle ad. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Add a useEffect to console log all form data changes for debugging
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);
  
  if (loading) {
    return (
      <div className="create-vehicle-ad">
        <header className="create-ad-header">
          <div className="logo-container">
            <Link to="/">
              <h1 className="logo">AutoHub</h1>
            </Link>
          </div>
          <div className="nav-buttons">
            <Link to="/browse" className="btn browse-btn">Browse Vehicles</Link>
          </div>
        </header>
        
        <div className="loading-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="create-vehicle-ad">
      <header className="create-ad-header">
        <div className="logo-container">
          <Link to="/">
            <h1 className="logo">AutoHub</h1>
          </Link>
        </div>
        <div className="nav-buttons">
          <Link to="/browse" className="btn browse-btn">Browse Vehicles</Link>
          <Link to="/my-ads" className="btn ads-btn">My Ads</Link>
          <Link to="/profile" className="btn profile-btn">Profile</Link>
          <button onClick={handleLogout} className="btn logout-btn">Logout</button>
        </div>
      </header>
      
      <main className="create-ad-main">
        <div className="form-container">
          <h1>Create Vehicle Ad</h1>
          
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
                
                <div className="form-group">
                  <label htmlFor="year">Year*</label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className={formErrors.year ? 'error' : ''}
                  />
                  {formErrors.year && <span className="field-error">{formErrors.year}</span>}
                </div>
              </div>
              
              <div className="form-row">
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
                    <option value="GASOLINE">Gasoline</option>
                    <option value="DIESEL">Diesel</option>
                    <option value="ELECTRIC">Electric</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="LPG">LPG</option>
                  </select>
                  {formErrors.fuelType && <span className="field-error">{formErrors.fuelType}</span>}
                </div>
                
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
                    <option value="AUTOMATIC">Automatic</option>
                    <option value="MANUAL">Manual</option>
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
                    min="0"
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
                    min="1"
                    className={formErrors.horsePower ? 'error' : ''}
                  />
                  {formErrors.horsePower && <span className="field-error">{formErrors.horsePower}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="color">Color</label>
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
              <h2>Ad Information</h2>
              
              <div className="form-group">
                <label htmlFor="title">Ad Title*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="E.g., 2022 BMW 3 Series - Excellent Condition"
                  className={formErrors.title ? 'error' : ''}
                />
                {formErrors.title && <span className="field-error">{formErrors.title}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Describe your vehicle, including features, condition, history, etc."
                ></textarea>
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
                    min="0"
                    step="0.01"
                    className={formErrors.price ? 'error' : ''}
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
                    placeholder="E.g., Sofia, Bulgaria"
                    className={formErrors.location ? 'error' : ''}
                  />
                  {formErrors.location && <span className="field-error">{formErrors.location}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="contactPhone">Contact Phone</label>
                  <input
                    type="text"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-section">
              <h2>Images</h2>
              
              <div className="form-group image-upload">
                <label htmlFor="images">Upload Images* (Up to 8)</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className={formErrors.imageUrls ? 'error' : ''}
                />
                <div className="image-upload-help">
                  You can select multiple images for your ad (maximum 8). The first image will be the main one.
                </div>
                {formData.imageUrls.length > 0 && (
                  <div className="image-count">
                    {formData.imageUrls.length}/8 images
                  </div>
                )}
                {formErrors.imageUrls && <span className="field-error">{formErrors.imageUrls}</span>}
              </div>
              
              {formData.imageUrls.length > 0 && (
                <div className="image-previews">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="image-preview">
                      <img src={url} alt={`Preview ${index + 1}`} />
                      {index === 0 && <div className="main-image-badge">Main</div>}
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
              )}
            </div>
            
            <div className="form-actions">
              <Link to="/my-ads" className="btn cancel-btn">Cancel</Link>
              <button 
                type="submit" 
                className="btn submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Ad'}
              </button>
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

export default CreateVehicleAd; 