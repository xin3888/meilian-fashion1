const express = require('express');
const router = express.Router();
const WhatsAppAPI = require('../config/whatsapp');
const {
  validateSendTextMessage,
  validateSendImageMessage,
  validateSendDocumentMessage,
  validateSendTemplateMessage,
  validateGetMessageStatus
} = require('../middleware/validation');

const whatsappAPI = new WhatsAppAPI();

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'WhatsApp API is running',
    timestamp: new Date().toISOString()
  });
});

// 发送文本消息
router.post('/send/text', validateSendTextMessage, async (req, res) => {
  try {
    const { to, text } = req.body;
    const result = await whatsappAPI.sendTextMessage(to, text);
    
    if (result.success) {
      res.json({
        success: true,
        message: '消息发送成功',
        messageId: result.messageId,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: '消息发送失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('发送文本消息路由错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 发送图片消息
router.post('/send/image', validateSendImageMessage, async (req, res) => {
  try {
    const { to, imageUrl, caption } = req.body;
    const result = await whatsappAPI.sendImageMessage(to, imageUrl, caption);
    
    if (result.success) {
      res.json({
        success: true,
        message: '图片消息发送成功',
        messageId: result.messageId,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: '图片消息发送失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('发送图片消息路由错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 发送文档消息
router.post('/send/document', validateSendDocumentMessage, async (req, res) => {
  try {
    const { to, documentUrl, filename, caption } = req.body;
    const result = await whatsappAPI.sendDocumentMessage(to, documentUrl, filename, caption);
    
    if (result.success) {
      res.json({
        success: true,
        message: '文档消息发送成功',
        messageId: result.messageId,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: '文档消息发送失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('发送文档消息路由错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 发送模板消息
router.post('/send/template', validateSendTemplateMessage, async (req, res) => {
  try {
    const { to, templateName, languageCode, components } = req.body;
    const result = await whatsappAPI.sendTemplateMessage(to, templateName, languageCode, components);
    
    if (result.success) {
      res.json({
        success: true,
        message: '模板消息发送成功',
        messageId: result.messageId,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: '模板消息发送失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('发送模板消息路由错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// 获取消息状态
router.get('/message/:messageId/status', validateGetMessageStatus, async (req, res) => {
  try {
    const { messageId } = req.params;
    const result = await whatsappAPI.getMessageStatus(messageId);
    
    if (result.success) {
      res.json({
        success: true,
        message: '获取消息状态成功',
        status: result.status,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: '获取消息状态失败',
        error: result.error
      });
    }
  } catch (error) {
    console.error('获取消息状态路由错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message
    });
  }
});

// Webhook验证
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const verificationResult = whatsappAPI.verifyWebhook(mode, token, challenge);
  
  if (verificationResult) {
    res.status(200).send(verificationResult);
  } else {
    res.status(403).json({
      success: false,
      message: 'Webhook验证失败'
    });
  }
});

// Webhook接收消息
router.post('/webhook', (req, res) => {
  try {
    const result = whatsappAPI.processIncomingMessage(req.body);
    
    if (result.success) {
      console.log('收到新消息:', result.message);
      
      // 这里可以添加消息处理逻辑
      // 例如：自动回复、消息存储、业务逻辑处理等
      
      res.status(200).json({
        success: true,
        message: '消息接收成功'
      });
    } else {
      console.log('没有收到有效消息');
      res.status(200).json({
        success: false,
        message: result.message
      });
    }
  } catch (error) {
    console.error('处理Webhook消息错误:', error);
    res.status(500).json({
      success: false,
      message: '处理消息失败',
      error: error.message
    });
  }
});

module.exports = router;