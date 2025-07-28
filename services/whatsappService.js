const axios = require('axios');
const logger = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.accessToken = process.env.WHATSAPP_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.baseURL = process.env.WHATSAPP_API_BASE_URL || 'https://graph.facebook.com/v18.0';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Send text message
  async sendMessage(to, message, type = 'text') {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: type,
        text: {
          body: message
        }
      };

      const response = await this.client.post(`/${this.phoneNumberId}/messages`, payload);
      
      logger.info(`Message sent to ${to}: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      logger.error('Error sending message:', error.response?.data || error.message);
      throw new Error(`Failed to send message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Send media (image, document, audio, video)
  async sendMedia(to, mediaUrl, mediaType, caption = '') {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: mediaType,
        [mediaType]: {
          link: mediaUrl,
          caption: caption
        }
      };

      const response = await this.client.post(`/${this.phoneNumberId}/messages`, payload);
      
      logger.info(`Media sent to ${to}: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      logger.error('Error sending media:', error.response?.data || error.message);
      throw new Error(`Failed to send media: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Send template message
  async sendTemplate(to, templateName, language = 'en', parameters = []) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: language
          },
          components: parameters.length > 0 ? [
            {
              type: 'body',
              parameters: parameters.map(param => ({
                type: 'text',
                text: param
              }))
            }
          ] : []
        }
      };

      const response = await this.client.post(`/${this.phoneNumberId}/messages`, payload);
      
      logger.info(`Template message sent to ${to}: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      logger.error('Error sending template:', error.response?.data || error.message);
      throw new Error(`Failed to send template: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Send interactive button message
  async sendButtonMessage(to, text, buttons) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: text
          },
          action: {
            buttons: buttons.map((button, index) => ({
              type: 'reply',
              reply: {
                id: `button_${index}`,
                title: button
              }
            }))
          }
        }
      };

      const response = await this.client.post(`/${this.phoneNumberId}/messages`, payload);
      
      logger.info(`Button message sent to ${to}: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      logger.error('Error sending button message:', error.response?.data || error.message);
      throw new Error(`Failed to send button message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Send list message
  async sendListMessage(to, text, buttonText, sections) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: {
            text: text
          },
          action: {
            button: buttonText,
            sections: sections
          }
        }
      };

      const response = await this.client.post(`/${this.phoneNumberId}/messages`, payload);
      
      logger.info(`List message sent to ${to}: ${response.data.messages[0].id}`);
      return response.data;
    } catch (error) {
      logger.error('Error sending list message:', error.response?.data || error.message);
      throw new Error(`Failed to send list message: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get message status
  async getMessageStatus(messageId) {
    try {
      const response = await this.client.get(`/${messageId}`);
      return response.data;
    } catch (error) {
      logger.error('Error getting message status:', error.response?.data || error.message);
      throw new Error(`Failed to get message status: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Get business profile
  async getBusinessProfile() {
    try {
      const response = await this.client.get(`/${this.phoneNumberId}?fields=name,status,quality_rating`);
      return response.data;
    } catch (error) {
      logger.error('Error getting business profile:', error.response?.data || error.message);
      throw new Error(`Failed to get business profile: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Mark message as read
  async markMessageAsRead(messageId) {
    try {
      const payload = {
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId
      };

      const response = await this.client.post(`/${this.phoneNumberId}/messages`, payload);
      return response.data;
    } catch (error) {
      logger.error('Error marking message as read:', error.response?.data || error.message);
      throw new Error(`Failed to mark message as read: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}

module.exports = new WhatsAppService();