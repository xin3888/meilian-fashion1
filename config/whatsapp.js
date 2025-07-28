const axios = require('axios');
require('dotenv').config();

class WhatsAppAPI {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    this.verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // 发送文本消息
  async sendTextMessage(to, text) {
    try {
      const response = await this.client.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: text
        }
      });
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('发送文本消息失败:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // 发送图片消息
  async sendImageMessage(to, imageUrl, caption = '') {
    try {
      const response = await this.client.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'image',
        image: {
          link: imageUrl,
          caption: caption
        }
      });
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('发送图片消息失败:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // 发送文档消息
  async sendDocumentMessage(to, documentUrl, filename, caption = '') {
    try {
      const response = await this.client.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'document',
        document: {
          link: documentUrl,
          caption: caption,
          filename: filename
        }
      });
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('发送文档消息失败:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // 发送模板消息
  async sendTemplateMessage(to, templateName, languageCode = 'zh_CN', components = []) {
    try {
      const response = await this.client.post(`/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          },
          components: components
        }
      });
      
      return {
        success: true,
        messageId: response.data.messages[0].id,
        data: response.data
      };
    } catch (error) {
      console.error('发送模板消息失败:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // 获取消息状态
  async getMessageStatus(messageId) {
    try {
      const response = await this.client.get(`/${messageId}`);
      return {
        success: true,
        status: response.data.status,
        data: response.data
      };
    } catch (error) {
      console.error('获取消息状态失败:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // 验证Webhook
  verifyWebhook(mode, token, challenge) {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    return null;
  }

  // 处理接收到的消息
  processIncomingMessage(body) {
    try {
      const entry = body.entry[0];
      const changes = entry.changes[0];
      const value = changes.value;
      
      if (value.messages && value.messages.length > 0) {
        const message = value.messages[0];
        return {
          success: true,
          message: {
            id: message.id,
            from: message.from,
            timestamp: message.timestamp,
            type: message.type,
            text: message.text?.body,
            image: message.image,
            document: message.document,
            audio: message.audio,
            video: message.video,
            location: message.location,
            contacts: message.contacts
          }
        };
      }
      
      return {
        success: false,
        message: 'No messages found'
      };
    } catch (error) {
      console.error('处理接收消息失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = WhatsAppAPI;