#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('🚀 WhatsApp API 项目设置向导\n');
  console.log('这个向导将帮助您配置 WhatsApp Business API 项目。\n');

  // 检查 .env 文件是否存在
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env 文件已存在，是否要覆盖？(y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ 设置已取消');
      rl.close();
      return;
    }
  }

  console.log('\n📋 请提供以下 WhatsApp Business API 配置信息：\n');

  // 收集配置信息
  const config = {};

  config.WHATSAPP_API_URL = await question('WhatsApp API URL (默认: https://graph.facebook.com/v18.0): ') || 'https://graph.facebook.com/v18.0';
  config.WHATSAPP_PHONE_NUMBER_ID = await question('Phone Number ID: ');
  config.WHATSAPP_ACCESS_TOKEN = await question('Access Token: ');
  config.WHATSAPP_VERIFY_TOKEN = await question('Webhook Verify Token: ');

  console.log('\n🔧 服务器配置：\n');
  config.PORT = await question('服务器端口 (默认: 3000): ') || '3000';
  config.NODE_ENV = await question('运行环境 (development/production, 默认: development): ') || 'development';

  console.log('\n🔒 安全配置：\n');
  config.JWT_SECRET = await question('JWT 密钥 (留空将自动生成): ') || generateRandomString(32);
  config.RATE_LIMIT_WINDOW_MS = await question('速率限制窗口 (毫秒, 默认: 900000): ') || '900000';
  config.RATE_LIMIT_MAX_REQUESTS = await question('最大请求数 (默认: 100): ') || '100';

  // 生成 .env 文件内容
  const envContent = `# WhatsApp Business API Configuration
WHATSAPP_API_URL=${config.WHATSAPP_API_URL}
WHATSAPP_PHONE_NUMBER_ID=${config.WHATSAPP_PHONE_NUMBER_ID}
WHATSAPP_ACCESS_TOKEN=${config.WHATSAPP_ACCESS_TOKEN}
WHATSAPP_VERIFY_TOKEN=${config.WHATSAPP_VERIFY_TOKEN}

# Server Configuration
PORT=${config.PORT}
NODE_ENV=${config.NODE_ENV}

# Security
JWT_SECRET=${config.JWT_SECRET}
RATE_LIMIT_WINDOW_MS=${config.RATE_LIMIT_WINDOW_MS}
RATE_LIMIT_MAX_REQUESTS=${config.RATE_LIMIT_MAX_REQUESTS}
`;

  try {
    // 写入 .env 文件
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env 文件创建成功！\n');

    // 检查依赖是否已安装
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');

    if (!fs.existsSync(nodeModulesPath)) {
      console.log('📦 正在安装依赖...');
      const { execSync } = require('child_process');
      execSync('npm install', { stdio: 'inherit' });
      console.log('✅ 依赖安装完成！\n');
    }

    console.log('🎉 项目设置完成！\n');
    console.log('📝 下一步：');
    console.log('1. 启动服务器: npm run dev');
    console.log('2. 访问 Web 界面: http://localhost:' + config.PORT);
    console.log('3. 测试 API: npm test');
    console.log('\n📚 更多信息请查看 README.md');

  } catch (error) {
    console.error('❌ 设置失败:', error.message);
  }

  rl.close();
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 运行设置
if (require.main === module) {
  setup();
}

module.exports = { setup };