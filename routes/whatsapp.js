const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappService');
const { validateMessage, validateMedia } = require('../middleware/validation');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');

// Send text message
router.post('/send-message', auth, validateMessage, async (req, res) => {
  try {
    const { to, message, type = 'text' } = req.body;
    
    const result = await whatsappService.sendMessage(to, message, type);
    
    logger.info(`Message sent successfully to ${to}`);
    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      data: result
    });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
      details: error.message
    });
  }
});

// Send media (image, document, etc.)
router.post('/send-media', auth, validateMedia, async (req, res) => {
  try {
    const { to, mediaUrl, mediaType, caption } = req.body;
    
    const result = await whatsappService.sendMedia(to, mediaUrl, mediaType, caption);
    
    logger.info(`Media sent successfully to ${to}`);
    res.status(200).json({
      success: true,
      message: 'Media sent successfully',
      data: result
    });
  } catch (error) {
    logger.error('Error sending media:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send media',
      details: error.message
    });
  }
});

// Send template message
router.post('/send-template', auth, async (req, res) => {
  try {
    const { to, templateName, language, parameters } = req.body;
    
    const result = await whatsappService.sendTemplate(to, templateName, language, parameters);
    
    logger.info(`Template message sent successfully to ${to}`);
    res.status(200).json({
      success: true,
      message: 'Template message sent successfully',
      data: result
    });
  } catch (error) {
    logger.error('Error sending template:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send template message',
      details: error.message
    });
  }
});

// Get message status
router.get('/message-status/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const status = await whatsappService.getMessageStatus(messageId);
    
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Error getting message status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get message status',
      details: error.message
    });
  }
});

// Get business profile
router.get('/business-profile', auth, async (req, res) => {
  try {
    const profile = await whatsappService.getBusinessProfile();
    
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    logger.error('Error getting business profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get business profile',
      details: error.message
    });
  }
});

module.exports = router;