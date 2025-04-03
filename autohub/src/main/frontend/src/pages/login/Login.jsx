import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.scss';
import { loginUser } from '../../services/api';

const Login = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  // State for error messages
  const [error, setError] = useState('');
  // State for tracking form submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes and clear errors when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user types
    if (error) setError('');
  };

  // Handle form submission and API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Log request data
      console.log('Login request:', {
        username: formData.username,
        password: formData.password.substring(0, 1) + '...' // Log just first character for security
      });
      
      const response = await loginUser({
        username: formData.username,
        password: formData.password
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries([...response.headers]));
      
      // Try to get response body whether it succeeds or fails
      const responseBody = await response.text();
      console.log('Response body:', responseBody);
      
      if (response.ok) {
        console.log('Login successful, redirecting to home page...');
        // Redirect on successful login
        window.location.href = '/';
      } else {
        // Set error message
        setError('Invalid username or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      // Reset submission status
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login">
      <header className="login-header">
        <div className="logo-container">
          <h1 className="logo">AutoHub</h1>
        </div>
      </header>
      
      <main className="login-main">
        <div className="login-form-container">
          <h2 className="form-title">Login to your account</h2>
          {/* Display error message if present */}
          {error && <div className="error-message">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            {/* Submit button with loading state */}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {/* Links for registration and password recovery */}
          <div className="form-footer">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
            <p><a href="/forgot-password">Forgot password?</a></p>
          </div>
        </div>
      </main>
      
      <footer className="login-footer">
        <p>&copy; 2025 AutoHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
