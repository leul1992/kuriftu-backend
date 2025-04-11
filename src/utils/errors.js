/**
 * Handle and format errors for API responses
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 */
export function handleError(res, error) {
  console.error('API Error:', error.message);
  
  // Supabase specific errors
  if (error.message.includes('Email rate limit exceeded')) {
    return res.status(429).json({
      status: 'error',
      message: 'Too many attempts. Please try again later.'
    });
  }
  
  if (error.message.includes('Invalid login credentials')) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid email or password'
    });
  }
  
  if (error.message.includes('User already registered')) {
    return res.status(409).json({
      status: 'error',
      message: 'User already exists'
    });
  }
  
  // Generic error response
  res.status(500).json({
    status: 'error',
    message: error.message || 'An unexpected error occurred'
  });
}
