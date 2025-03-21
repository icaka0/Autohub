import React, { useState } from 'react';
import './Register.scss'; // Create this file for styling
import { registerUser } from '../../services/api'; // Import API function for registration

const Register = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  // State for field-specific error messages
  const [errors, setErrors] = useState({});
  // State for general error message
  const [generalError, setGeneralError] = useState('');
  // State for tracking form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes and clear errors when user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error when user types
    if (generalError) {
      setGeneralError('');
    }
  };

  // Validate form fields before submission
  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (formData.username.length < 4 || formData.username.length > 20) {
      newErrors.username = "Username must be between 4 and 20 characters";
    }
    
    // First name validation
    if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }
    
    // Last name validation (only if not empty)
    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = "Last name must be at most 50 characters";
    }
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    // Validate password length
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone number validation
    if (formData.phoneNumber.length < 8 || formData.phoneNumber.length > 15) {
      newErrors.phoneNumber = "Phone number must be between 8 and 15 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }
    
    setIsSubmitting(true);
    setGeneralError('');
    
    try {
      // Call register API endpoint
      const response = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phoneNumber: formData.phoneNumber
      });
      
      if (response.ok) {
        // Handle success on frontend - navigate to login page
        const data = await response.json();
        console.log('Registration successful:', data);
        
        // Navigate to login page
        window.location.href = '/login?registered=true';
      } else {
        // Handle error response from server
        const errorData = await response.json().catch(() => ({}));
        if (errorData.fieldErrors) {
          // Handle field-specific errors returned from backend
          const fieldErrors = {};
          errorData.fieldErrors.forEach(err => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          // Handle general error
          setGeneralError(errorData.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError('Network error. Please check your connection and try again.');
    } finally {
      // Reset submission status
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register">
      <header className="register-header">
        <div className="logo-container">
          <h1 className="logo">AutoHub</h1>
        </div>
      </header>
      
      <main className="register-main">
        <div className="register-form-container">
          <h2 className="form-title">Create an account</h2>
          {generalError && <div className="error-message general-error">{generalError}</div>}
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  required
                />
                {errors.firstName && <span className="field-error">{errors.firstName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="optional">(optional)</span></label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <span className="field-error">{errors.lastName}</span>}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
              />
              {errors.username && <span className="field-error">{errors.username}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength="8"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="8"
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
              {errors.phoneNumber && <span className="field-error">{errors.phoneNumber}</span>}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="form-footer">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>
      </main>
      
      <footer className="register-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
