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

// Get a user's vehicle ads
export const getUserVehicleAds = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/vehicle-ads/my-ads', {
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ads: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user vehicle ads:', error);
    throw error;
  }
};

// Create a new vehicle ad
export const createVehicleAd = async (adData) => {
  try {
    console.log('API call started - Creating vehicle ad with data:', adData);
    
    // Log the JSON being sent to check for any issues
    console.log('Request JSON:', JSON.stringify(adData));
    
    const response = await fetch('http://localhost:8080/api/vehicle-ads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adData),
      credentials: 'include',
      mode: 'cors'
    });
    
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`Failed to create ad: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('API response data:', responseData);
    return responseData;
  } catch (error) {
    console.error('Error in createVehicleAd API call:', error);
    throw error;
  }
};

// Update a vehicle ad status
export const updateVehicleAdStatus = async (adId, status) => {
  try {
    const response = await fetch(`http://localhost:8080/api/vehicle-ads/${adId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ad status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating vehicle ad status:', error);
    throw error;
  }
};

// Delete a vehicle ad
export const deleteVehicleAd = async (adId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/vehicle-ads/${adId}`, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete ad: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting vehicle ad:', error);
    throw error;
  }
};

// Get all vehicle ads with optional filters
export const getAllVehicleAds = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    console.log('Fetching vehicles with filters:', filters);
    console.log('Query params:', queryParams.toString());
    
    const response = await fetch(
      `http://localhost:8080/api/vehicle-ads?${queryParams}`,
      {
        credentials: 'include', // This still allows cookies to be sent if available
        mode: 'cors'
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch ads: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched vehicle ads:', data);
    return data;
  } catch (error) {
    console.error('Error fetching all vehicle ads:', error);
    throw error;
  }
};

// Get a single vehicle ad by ID
export const getVehicleAdById = async (adId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/vehicle-ads/${adId}`, {
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ad: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching vehicle ad:', error);
    throw error;
  }
};

/**
 * Update an existing vehicle ad
 */
export const updateVehicleAd = async (id, adData) => {
  try {
    const response = await fetch(`http://localhost:8080/api/vehicle-ads/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(adData),
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to update ad: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating vehicle ad:', error);
    throw error;
  }
};

// Add this function to your utility functions
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Add this utility function to compress images
export const compressImage = async (file) => {
  // Always compress images, regardless of size
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Create an image element and load the file
  const img = new Image();
  return new Promise((resolve) => {
    img.onload = () => {
      // Calculate new dimensions (max width 800px)
      const maxWidth = 800;
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      
      // Set canvas dimensions and draw the resized image
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to base64 with moderate compression (0.3 quality)
      const base64 = canvas.toDataURL('image/jpeg', 0.3);
      
      resolve(base64);
    };
    
    // Load the file into the image
    img.src = URL.createObjectURL(file);
  });
};
