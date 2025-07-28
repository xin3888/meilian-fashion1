const logger = require('../utils/logger');

// Simple API key authentication middleware
const auth = (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key is required',
        message: 'Please provide an API key in the X-API-Key header or Authorization header'
      });
    }

    // Remove 'Bearer ' prefix if present
    const cleanApiKey = apiKey.replace('Bearer ', '');
    
    // Check against configured API secret
    if (cleanApiKey !== process.env.API_SECRET_KEY) {
      logger.warn(`Invalid API key attempt from IP: ${req.ip}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid API key',
        message: 'The provided API key is not valid'
      });
    }

    // API key is valid, proceed to next middleware
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};

module.exports = auth;