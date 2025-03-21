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
    
    const response = await fetch(`http://localhost:8080/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
      mode: 'cors',
      redirect: 'manual'
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
