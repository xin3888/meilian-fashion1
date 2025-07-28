const axios = require('axios');

// API配置
const API_BASE_URL = 'http://localhost:3000';
const API_KEY = 'test_secret_key_123'; // 请在.env文件中设置实际的密钥

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  }
});

// 测试函数
async function testAPI() {
  console.log('🚀 开始测试WhatsApp API...\n');

  try {
    // 1. 测试健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ 健康检查成功:', healthResponse.data);
    console.log('');

    // 注意：以下测试需要有效的WhatsApp凭据
    console.log('⚠️  注意：以下测试需要有效的WhatsApp API凭据');
    console.log('请在.env文件中配置WHATSAPP_TOKEN和WHATSAPP_PHONE_NUMBER_ID');
    console.log('');

    // 2. 测试发送文本消息（需要有效凭据）
    console.log('2. 测试发送文本消息...');
    try {
      const messageResponse = await api.post('/api/whatsapp/send-message', {
        to: '1234567890', // 替换为实际的测试号码
        message: '这是一个测试消息！',
        type: 'text'
      });
      console.log('✅ 文本消息发送成功:', messageResponse.data);
    } catch (error) {
      console.log('❌ 文本消息发送失败 (需要有效的WhatsApp凭据):', error.response?.data || error.message);
    }
    console.log('');

    // 3. 测试发送媒体文件（需要有效凭据）
    console.log('3. 测试发送媒体文件...');
    try {
      const mediaResponse = await api.post('/api/whatsapp/send-media', {
        to: '1234567890', // 替换为实际的测试号码
        mediaUrl: 'https://via.placeholder.com/300x200.png',
        mediaType: 'image',
        caption: '这是一张测试图片'
      });
      console.log('✅ 媒体文件发送成功:', mediaResponse.data);
    } catch (error) {
      console.log('❌ 媒体文件发送失败 (需要有效的WhatsApp凭据):', error.response?.data || error.message);
    }
    console.log('');

    // 4. 测试获取业务资料（需要有效凭据）
    console.log('4. 测试获取业务资料...');
    try {
      const profileResponse = await api.get('/api/whatsapp/business-profile');
      console.log('✅ 业务资料获取成功:', profileResponse.data);
    } catch (error) {
      console.log('❌ 业务资料获取失败 (需要有效的WhatsApp凭据):', error.response?.data || error.message);
    }
    console.log('');

    // 5. 测试无效的API密钥
    console.log('5. 测试API认证...');
    try {
      const invalidAPI = axios.create({
        baseURL: API_BASE_URL,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'invalid_key'
        }
      });
      
      await invalidAPI.post('/api/whatsapp/send-message', {
        to: '1234567890',
        message: 'test',
        type: 'text'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ API认证正常工作 (拒绝了无效密钥)');
      } else {
        console.log('❌ API认证测试失败:', error.response?.data || error.message);
      }
    }
    console.log('');

  } catch (error) {
    console.error('❌ 测试过程中发生错误:', error.message);
  }

  console.log('🏁 测试完成');
}

// 运行测试
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };