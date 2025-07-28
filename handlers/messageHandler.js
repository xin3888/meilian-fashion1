const logger = require('../utils/logger');
const whatsappService = require('../services/whatsappService');

class MessageHandler {
  // Handle incoming messages
  async handleIncomingMessages(messages, contacts) {
    for (const message of messages) {
      try {
        const contact = contacts?.find(c => c.wa_id === message.from);
        const contactName = contact?.profile?.name || 'Unknown';
        
        logger.info(`Received message from ${contactName} (${message.from}): ${message.type}`);

        // Mark message as read
        await whatsappService.markMessageAsRead(message.id);

        // Process different message types
        switch (message.type) {
          case 'text':
            await this.handleTextMessage(message, contactName);
            break;
          case 'image':
            await this.handleImageMessage(message, contactName);
            break;
          case 'document':
            await this.handleDocumentMessage(message, contactName);
            break;
          case 'audio':
            await this.handleAudioMessage(message, contactName);
            break;
          case 'video':
            await this.handleVideoMessage(message, contactName);
            break;
          case 'interactive':
            await this.handleInteractiveMessage(message, contactName);
            break;
          default:
            logger.info(`Unsupported message type: ${message.type}`);
        }

      } catch (error) {
        logger.error('Error handling incoming message:', error);
      }
    }
  }

  // Handle text messages
  async handleTextMessage(message, contactName) {
    const text = message.text.body.toLowerCase();
    
    logger.info(`Text message from ${contactName}: ${text}`);

    // Simple auto-reply logic (customize as needed)
    if (text.includes('hello') || text.includes('hi')) {
      await whatsappService.sendMessage(
        message.from,
        `Hello ${contactName}! Welcome to our WhatsApp Business. How can I help you today?`
      );
    } else if (text.includes('help')) {
      await whatsappService.sendButtonMessage(
        message.from,
        'How can I assist you today?',
        ['Product Info', 'Support', 'Contact Sales']
      );
    } else if (text.includes('menu')) {
      const sections = [
        {
          title: 'Products',
          rows: [
            { id: 'product_1', title: 'Product 1', description: 'Description of product 1' },
            { id: 'product_2', title: 'Product 2', description: 'Description of product 2' }
          ]
        },
        {
          title: 'Services',
          rows: [
            { id: 'service_1', title: 'Service 1', description: 'Description of service 1' },
            { id: 'service_2', title: 'Service 2', description: 'Description of service 2' }
          ]
        }
      ];

      await whatsappService.sendListMessage(
        message.from,
        'Please choose from our menu:',
        'View Options',
        sections
      );
    } else {
      // Default response
      await whatsappService.sendMessage(
        message.from,
        'Thank you for your message! Our team will get back to you soon. Type "help" for quick assistance or "menu" to see our options.'
      );
    }
  }

  // Handle image messages
  async handleImageMessage(message, contactName) {
    logger.info(`Image message from ${contactName}`);
    
    await whatsappService.sendMessage(
      message.from,
      'Thank you for sharing the image! Our team will review it and get back to you.'
    );
  }

  // Handle document messages
  async handleDocumentMessage(message, contactName) {
    logger.info(`Document message from ${contactName}: ${message.document.filename}`);
    
    await whatsappService.sendMessage(
      message.from,
      `Thank you for sharing the document "${message.document.filename}". We'll review it and respond accordingly.`
    );
  }

  // Handle audio messages
  async handleAudioMessage(message, contactName) {
    logger.info(`Audio message from ${contactName}`);
    
    await whatsappService.sendMessage(
      message.from,
      'Thank you for the voice message! Our team will listen to it and respond soon.'
    );
  }

  // Handle video messages
  async handleVideoMessage(message, contactName) {
    logger.info(`Video message from ${contactName}`);
    
    await whatsappService.sendMessage(
      message.from,
      'Thank you for sharing the video! We\'ll review it and get back to you.'
    );
  }

  // Handle interactive messages (button/list responses)
  async handleInteractiveMessage(message, contactName) {
    const interactive = message.interactive;
    
    if (interactive.type === 'button_reply') {
      const buttonId = interactive.button_reply.id;
      const buttonTitle = interactive.button_reply.title;
      
      logger.info(`Button response from ${contactName}: ${buttonTitle}`);
      
      // Handle button responses
      switch (buttonTitle) {
        case 'Product Info':
          await whatsappService.sendMessage(
            message.from,
            'Here\'s information about our products...'
          );
          break;
        case 'Support':
          await whatsappService.sendMessage(
            message.from,
            'Our support team will contact you shortly. You can also call us at +1234567890.'
          );
          break;
        case 'Contact Sales':
          await whatsappService.sendMessage(
            message.from,
            'Our sales team will reach out to you within 24 hours. Thank you for your interest!'
          );
          break;
      }
    } else if (interactive.type === 'list_reply') {
      const listId = interactive.list_reply.id;
      const listTitle = interactive.list_reply.title;
      
      logger.info(`List response from ${contactName}: ${listTitle}`);
      
      await whatsappService.sendMessage(
        message.from,
        `Thank you for selecting "${listTitle}". We'll provide more information about this option shortly.`
      );
    }
  }

  // Handle status updates
  async handleStatusUpdates(statuses) {
    for (const status of statuses) {
      logger.info(`Message status update: ${status.id} - ${status.status}`);
      
      // You can add custom logic here to handle different status updates
      // e.g., delivered, read, failed, etc.
    }
  }
}

module.exports = new MessageHandler();