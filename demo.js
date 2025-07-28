#!/usr/bin/env node

const WhatsAppAPI = require('./config/whatsapp');

async function demo() {
  console.log('🚀 WhatsApp API 演示\n');
  
  // 创建 WhatsApp API 实例
  const whatsapp = new WhatsAppAPI();
  
  console.log('📋 配置信息:');
  console.log(`- API URL: ${whatsapp.apiUrl}`);
  console.log(`- Phone Number ID: ${whatsapp.phoneNumberId}`);
  console.log(`- Access Token: ${whatsapp.accessToken ? '已配置' : '未配置'}`);
  console.log(`- Verify Token: ${whatsapp.verifyToken ? '已配置' : '未配置'}\n`);
  
  console.log('🔧 可用功能:');
  console.log('1. 发送文本消息 - whatsapp.sendTextMessage(to, text)');
  console.log('2. 发送图片消息 - whatsapp.sendImageMessage(to, imageUrl, caption)');
  console.log('3. 发送文档消息 - whatsapp.sendDocumentMessage(to, documentUrl, filename, caption)');
  console.log('4. 发送模板消息 - whatsapp.sendTemplateMessage(to, templateName, languageCode, components)');
  console.log('5. 查询消息状态 - whatsapp.getMessageStatus(messageId)');
  console.log('6. Webhook 验证 - whatsapp.verifyWebhook(mode, token, challenge)');
  console.log('7. 处理接收消息 - whatsapp.processIncomingMessage(body)\n');
  
  console.log('📱 API 端点:');
  console.log('- 健康检查: GET /api/whatsapp/health');
  console.log('- 发送文本: POST /api/whatsapp/send/text');
  console.log('- 发送图片: POST /api/whatsapp/send/image');
  console.log('- 发送文档: POST /api/whatsapp/send/document');
  console.log('- 发送模板: POST /api/whatsapp/send/template');
  console.log('- 消息状态: GET /api/whatsapp/message/:messageId/status');
  console.log('- Webhook: GET/POST /api/whatsapp/webhook\n');
  
  console.log('🌐 Web 界面:');
  console.log('- 访问 http://localhost:3000 使用现代化测试界面\n');
  
  console.log('📝 使用示例:');
  console.log(`
// 发送文本消息
const result = await whatsapp.sendTextMessage('1234567890@c.us', 'Hello from API!');

// 发送图片消息
const imageResult = await whatsapp.sendImageMessage(
  '1234567890@c.us', 
  'https://example.com/image.jpg', 
  '图片说明'
);

// 查询消息状态
const statusResult = await whatsapp.getMessageStatus('wamid.xxx');
  `);
  
  console.log('🎯 下一步:');
  console.log('1. 运行 npm run setup 进行配置');
  console.log('2. 运行 npm run dev 启动服务器');
  console.log('3. 访问 http://localhost:3000 测试功能');
  console.log('4. 运行 npm test 进行API测试\n');
  
  console.log('📚 更多信息请查看 README.md 和 QUICKSTART.md');
}

// 运行演示
if (require.main === module) {
  demo().catch(console.error);
}

module.exports = { demo };