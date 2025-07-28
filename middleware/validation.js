const Joi = require('joi');

// 验证发送文本消息的请求
const validateSendTextMessage = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().pattern(/^\d+@c\.us$/).required(),
    text: Joi.string().min(1).max(4096).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

// 验证发送图片消息的请求
const validateSendImageMessage = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().pattern(/^\d+@c\.us$/).required(),
    imageUrl: Joi.string().uri().required(),
    caption: Joi.string().max(1024).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

// 验证发送文档消息的请求
const validateSendDocumentMessage = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().pattern(/^\d+@c\.us$/).required(),
    documentUrl: Joi.string().uri().required(),
    filename: Joi.string().required(),
    caption: Joi.string().max(1024).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

// 验证发送模板消息的请求
const validateSendTemplateMessage = (req, res, next) => {
  const schema = Joi.object({
    to: Joi.string().pattern(/^\d+@c\.us$/).required(),
    templateName: Joi.string().required(),
    languageCode: Joi.string().default('zh_CN'),
    components: Joi.array().optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

// 验证获取消息状态的请求
const validateGetMessageStatus = (req, res, next) => {
  const schema = Joi.object({
    messageId: Joi.string().required()
  });

  const { error } = schema.validate(req.params);
  if (error) {
    return res.status(400).json({
      success: false,
      error: error.details[0].message
    });
  }
  next();
};

module.exports = {
  validateSendTextMessage,
  validateSendImageMessage,
  validateSendDocumentMessage,
  validateSendTemplateMessage,
  validateGetMessageStatus
};