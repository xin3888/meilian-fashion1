const axios = require('axios');

// 测试配置
const BASE_URL = 'http://localhost:3000/api/whatsapp';
const TEST_PHONE = '1234567890@c.us';

// 测试用例
async function runTests() {
  console.log('🧪 开始 WhatsApp API 测试...\n');

  try {
    // 测试1: 健康检查
    console.log('1. 测试健康检查...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ 健康检查通过:', healthResponse.data);
    console.log('');

    // 测试2: 发送文本消息
    console.log('2. 测试发送文本消息...');
    const textResponse = await axios.post(`${BASE_URL}/send/text`, {
      to: TEST_PHONE,
      text: '这是一条测试消息 - ' + new Date().toLocaleString()
    });
    console.log('✅ 文本消息发送成功:', textResponse.data);
    console.log('');

    // 测试3: 发送图片消息
    console.log('3. 测试发送图片消息...');
    const imageResponse = await axios.post(`${BASE_URL}/send/image`, {
      to: TEST_PHONE,
      imageUrl: 'https://via.placeholder.com/300x200/25d366/ffffff?text=WhatsApp+API+Test',
      caption: '测试图片消息'
    });
    console.log('✅ 图片消息发送成功:', imageResponse.data);
    console.log('');

    // 测试4: 发送文档消息
    console.log('4. 测试发送文档消息...');
    const documentResponse = await axios.post(`${BASE_URL}/send/document`, {
      to: TEST_PHONE,
      documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      filename: 'test-document.pdf',
      caption: '测试文档消息'
    });
    console.log('✅ 文档消息发送成功:', documentResponse.data);
    console.log('');

    // 测试5: 发送模板消息
    console.log('5. 测试发送模板消息...');
    const templateResponse = await axios.post(`${BASE_URL}/send/template`, {
      to: TEST_PHONE,
      templateName: 'hello_world',
      languageCode: 'zh_CN'
    });
    console.log('✅ 模板消息发送成功:', templateResponse.data);
    console.log('');

    // 测试6: 查询消息状态 (如果有消息ID)
    if (textResponse.data.messageId) {
      console.log('6. 测试查询消息状态...');
      const statusResponse = await axios.get(`${BASE_URL}/message/${textResponse.data.messageId}/status`);
      console.log('✅ 消息状态查询成功:', statusResponse.data);
      console.log('');
    }

    console.log('🎉 所有测试通过！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      console.log('\n💡 提示: 请检查以下配置:');
      console.log('1. 确保 .env 文件已正确配置');
      console.log('2. 确保 WhatsApp Business API 凭据有效');
      console.log('3. 确保测试电话号码格式正确');
    }
  }
}

// 运行测试
if (require.main === module) {
  runTests();
}

module.exports = { runTests };