/**
 * Handles API errors consistently
 * @param {Error} error - The error that occurred
 * @param {string} defaultMessage - Default message to show if error details are not available
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error(`${defaultMessage}:`, error);
  
  // You could add toast notifications or other error handling here
};