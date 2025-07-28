const Joi = require('joi');
const logger = require('../utils/logger');

// Validation schema for sending messages
const messageSchema = Joi.object({
  to: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits and be 10-15 characters long',
      'any.required': 'Recipient phone number is required'
    }),
  message: Joi.string()
    .min(1)
    .max(4096)
    .required()
    .messages({
      'string.min': 'Message cannot be empty',
      'string.max': 'Message cannot exceed 4096 characters',
      'any.required': 'Message content is required'
    }),
  type: Joi.string()
    .valid('text')
    .default('text')
});

// Validation schema for sending media
const mediaSchema = Joi.object({
  to: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits and be 10-15 characters long',
      'any.required': 'Recipient phone number is required'
    }),
  mediaUrl: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Media URL must be a valid URL',
      'any.required': 'Media URL is required'
    }),
  mediaType: Joi.string()
    .valid('image', 'document', 'audio', 'video')
    .required()
    .messages({
      'any.only': 'Media type must be one of: image, document, audio, video',
      'any.required': 'Media type is required'
    }),
  caption: Joi.string()
    .max(1024)
    .allow('')
    .messages({
      'string.max': 'Caption cannot exceed 1024 characters'
    })
});

// Validation schema for template messages
const templateSchema = Joi.object({
  to: Joi.string()
    .pattern(/^\d{10,15}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits and be 10-15 characters long',
      'any.required': 'Recipient phone number is required'
    }),
  templateName: Joi.string()
    .min(1)
    .max(512)
    .required()
    .messages({
      'string.min': 'Template name cannot be empty',
      'string.max': 'Template name cannot exceed 512 characters',
      'any.required': 'Template name is required'
    }),
  language: Joi.string()
    .pattern(/^[a-z]{2}(_[A-Z]{2})?$/)
    .default('en')
    .messages({
      'string.pattern.base': 'Language must be in format: en, es, pt_BR, etc.'
    }),
  parameters: Joi.array()
    .items(Joi.string().max(1024))
    .max(10)
    .default([])
    .messages({
      'array.max': 'Maximum 10 parameters allowed',
      'string.max': 'Each parameter cannot exceed 1024 characters'
    })
});

// Middleware to validate message data
const validateMessage = (req, res, next) => {
  const { error, value } = messageSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    logger.warn('Message validation failed:', errors);
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  req.body = value;
  next();
};

// Middleware to validate media data
const validateMedia = (req, res, next) => {
  const { error, value } = mediaSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    logger.warn('Media validation failed:', errors);
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  req.body = value;
  next();
};

// Middleware to validate template data
const validateTemplate = (req, res, next) => {
  const { error, value } = templateSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    logger.warn('Template validation failed:', errors);
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }
  
  req.body = value;
  next();
};

module.exports = {
  validateMessage,
  validateMedia,
  validateTemplate
};