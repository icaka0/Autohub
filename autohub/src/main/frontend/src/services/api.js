/**
 * Authenticates a user with username and password
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - User's username
 * @param {string} credentials.password - User's password
 * @returns {Promise<Response>} The fetch response object
 */
export const loginUser = async (credentials) => {
  try {
    console.log('Sending login request to:', 'http://localhost:8080/login');
    
    // Create URLSearchParams for form data
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    const response = await fetch(`http://localhost:8080/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      credentials: 'include',
      mode: 'cors',
    });
    
    console.log('Login response status:', response.status);
    return response;
  } catch (error) {
    console.error('Login fetch error:', error);
    throw error;
  }
};

/**
 * Registers a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name (optional)
 * @param {string} userData.username - User's username
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @param {string} userData.confirmPassword - Password confirmation
 * @param {string} userData.phoneNumber - User's phone number
 * @returns {Promise<Response>} The fetch response object
 */
export const registerUser = async (userData) => {
  try {
    console.log('Sending registration request to:', 'http://localhost:8080/api/auth/register');
    console.log('With data:', {...userData, password: '***', confirmPassword: '***'});
    
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      mode: 'cors'
    });
    
    console.log('Registration response status:', response.status);
    
    if (!response.ok) {
      try {
        const text = await response.text();
        console.log('Error response body:', text);
      } catch (e) {
        console.log('Could not read response body');
      }
    }
    
    return response;
  } catch (error) {
    console.error('Registration fetch error:', error);
    throw error;
  }
};

/**
 * Checks if the user is currently authenticated
 * @returns {Promise<Object|false>} The user data or false if not authenticated
 */
export const checkAuthStatus = async () => {
  
  try {
    console.log('Checking authentication status...');
    const response = await fetch('http://localhost:8080/api/user/current', {
      credentials: 'include', // Important for sending cookies
      mode: 'cors'
    });
    
    console.log('Auth check response status:', response.status);
    
    if (response.ok) {
      const userData = await response.json();
      console.log('Auth check response data:', userData);
      
      // If the server returns {authenticated: false}, the user is not authenticated
      if (userData.authenticated === false) {
        console.log('User is not authenticated');
        return false;
      }
      
      // If we get here, the response contains user data, so the user is authenticated
      // userData will have user properties like id, username, etc.
      console.log('User is authenticated:', userData.username);
      return userData;
    }
    
    console.log('Auth check failed with status:', response.status);
    return false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

/**
 * Logs out the current user
 * @returns {Promise<Response>} The fetch response object
 */
export const logoutUser = async () => {
  try {
    const response = await fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include',
      mode: 'cors'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};
