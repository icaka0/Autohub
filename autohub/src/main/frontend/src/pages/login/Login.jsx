import React, { useState } from 'react';
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
      // Call login API endpoint
      const response = await loginUser({
        username: formData.username,
        password: formData.password
      });
      
      if (response.ok) {
        // Redirect on successful login
        window.location.href = '/';
      } else {
        // Extract and display error message from response
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Invalid username or password. Please try again.');
      }
    } catch (error) {
      // Handle network or other errors
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
            <p>Don't have an account? <a href="/register">Register</a></p>
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
