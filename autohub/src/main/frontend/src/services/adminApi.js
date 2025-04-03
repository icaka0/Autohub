import { handleApiError } from './errorHandler';

/**
 * Get all users (admin only)
 * @returns {Promise<Array>} Array of user objects
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/admin/users', {
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, 'Error fetching users');
    throw error;
  }
};

/**
 * Update a user's role (admin only)
 * @param {string} userId - The user's ID
 * @param {string} role - The new role (USER or ADMIN)
 * @returns {Promise<Object>} Updated user object
 */
export const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
      credentials: 'include',
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user role: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, 'Error updating user role');
    throw error;
  }
};