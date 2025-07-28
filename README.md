# WhatsApp Business API

一个基于Node.js和Express的WhatsApp Business API集成项目，提供完整的消息发送、接收和处理功能。

## 功能特性

- 📱 发送文本消息
- 🖼️ 发送媒体文件（图片、文档、音频、视频）
- 📋 发送模板消息
- 🔘 发送交互式按钮消息
- 📝 发送列表消息
- 📨 接收和处理传入消息
- 🔄 消息状态跟踪
- 🔐 API认证和安全性
- 📊 完整的日志记录
- ⚡ 速率限制保护

## 技术栈

- Node.js
- Express.js
- WhatsApp Business API
- Axios (HTTP客户端)
- Winston (日志记录)
- Joi (数据验证)
- Helmet (安全中间件)

## 安装和设置

### 1. 克隆项目并安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
# WhatsApp Business API Configuration
WHATSAPP_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
API_SECRET_KEY=your_secret_key_for_api_authentication

# WhatsApp API Base URL
WHATSAPP_API_BASE_URL=https://graph.facebook.com/v18.0
```

### 3. 获取WhatsApp Business API凭据

1. 访问 [Facebook Developers](https://developers.facebook.com/)
2. 创建一个应用程序
3. 添加WhatsApp Business产品
4. 获取访问令牌和电话号码ID
5. 设置Webhook URL（用于接收消息）

### 4. 启动服务器

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务器将在端口3000上启动。

## API文档

### 认证

所有API请求都需要在请求头中包含API密钥：

```
X-API-Key: your_secret_key
```

或者：

```
Authorization: Bearer your_secret_key
```

### API端点

#### 1. 发送文本消息

```http
POST /api/whatsapp/send-message
Content-Type: application/json
X-API-Key: your_secret_key

{
  "to": "1234567890",
  "message": "Hello, this is a test message!",
  "type": "text"
}
```

#### 2. 发送媒体文件

```http
POST /api/whatsapp/send-media
Content-Type: application/json
X-API-Key: your_secret_key

{
  "to": "1234567890",
  "mediaUrl": "https://example.com/image.jpg",
  "mediaType": "image",
  "caption": "Check out this image!"
}
```

支持的媒体类型：`image`, `document`, `audio`, `video`

#### 3. 发送模板消息

```http
POST /api/whatsapp/send-template
Content-Type: application/json
X-API-Key: your_secret_key

{
  "to": "1234567890",
  "templateName": "hello_world",
  "language": "en",
  "parameters": ["John", "Doe"]
}
```

#### 4. 获取消息状态

```http
GET /api/whatsapp/message-status/{messageId}
X-API-Key: your_secret_key
```

#### 5. 获取业务资料

```http
GET /api/whatsapp/business-profile
X-API-Key: your_secret_key
```

### Webhook端点

#### Webhook验证

```http
GET /webhook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=challenge_string
```

#### 接收消息

```http
POST /webhook
Content-Type: application/json

{
  "object": "whatsapp_business_account",
  "entry": [...]
}
```

## 消息处理

项目包含智能消息处理功能：

- **自动回复**：根据关键词自动回复
- **交互式按钮**：当用户发送"help"时显示按钮选项
- **列表菜单**：当用户发送"menu"时显示产品/服务列表
- **媒体处理**：自动确认收到的图片、文档等
- **状态跟踪**：跟踪消息投递状态

## 安全性

- API密钥认证
- 请求速率限制
- Webhook签名验证
- Helmet安全头
- 输入数据验证

## 日志记录

- 所有操作都会记录详细日志
- 错误日志单独存储
- 支持不同日志级别
- 开发环境控制台输出

## 错误处理

API返回标准化的错误响应：

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Additional error information"
}
```

## 部署

### 使用PM2部署

```bash
npm install -g pm2
pm2 start server.js --name "whatsapp-api"
pm2 startup
pm2 save
```

### 使用Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 测试

```bash
npm test
```

## 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。

## 支持

如果您遇到任何问题或需要帮助，请：

1. 查看文档
2. 检查日志文件
3. 创建 Issue
4. 联系开发团队

## 更新日志

### v1.0.0
- 初始发布
- 基本消息发送功能
- Webhook集成
- 自动回复系统
- 完整的API文档