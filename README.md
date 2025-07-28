# WhatsApp Business API 集成

这是一个完整的 WhatsApp Business API 集成项目，提供了发送消息、接收消息、处理媒体文件等功能。

## 🚀 功能特性

- ✅ 发送文本消息
- ✅ 发送图片消息
- ✅ 发送文档消息
- ✅ 发送模板消息
- ✅ 查询消息状态
- ✅ Webhook 消息接收
- ✅ 现代化的 Web 测试界面
- ✅ 完整的错误处理
- ✅ 请求验证
- ✅ 速率限制
- ✅ 安全防护

## 📋 系统要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器
- WhatsApp Business API 账户

## 🛠️ 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd whatsapp-api-integration
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件，填入您的 WhatsApp Business API 配置：
   ```env
   # WhatsApp Business API Configuration
   WHATSAPP_API_URL=https://graph.facebook.com/v18.0
   WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
   WHATSAPP_ACCESS_TOKEN=your_access_token
   WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Security
   JWT_SECRET=your_jwt_secret_key
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **启动服务器**
   ```bash
   # 开发模式
   npm run dev
   
   # 生产模式
   npm start
   ```

## 📱 API 接口

### 基础信息
- **基础URL**: `http://localhost:3000/api/whatsapp`
- **健康检查**: `GET /api/whatsapp/health`

### 发送消息

#### 发送文本消息
```http
POST /api/whatsapp/send/text
Content-Type: application/json

{
  "to": "1234567890@c.us",
  "text": "Hello, World!"
}
```

#### 发送图片消息
```http
POST /api/whatsapp/send/image
Content-Type: application/json

{
  "to": "1234567890@c.us",
  "imageUrl": "https://example.com/image.jpg",
  "caption": "图片说明"
}
```

#### 发送文档消息
```http
POST /api/whatsapp/send/document
Content-Type: application/json

{
  "to": "1234567890@c.us",
  "documentUrl": "https://example.com/document.pdf",
  "filename": "document.pdf",
  "caption": "文档说明"
}
```

#### 发送模板消息
```http
POST /api/whatsapp/send/template
Content-Type: application/json

{
  "to": "1234567890@c.us",
  "templateName": "hello_world",
  "languageCode": "zh_CN",
  "components": []
}
```

### 查询消息状态
```http
GET /api/whatsapp/message/{messageId}/status
```

### Webhook 配置

#### Webhook 验证
```http
GET /api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token={token}&hub.challenge={challenge}
```

#### 接收消息
```http
POST /api/whatsapp/webhook
Content-Type: application/json

{
  "object": "whatsapp_business_account",
  "entry": [
    {
      "id": "phone_number_id",
      "changes": [
        {
          "value": {
            "messaging_product": "whatsapp",
            "metadata": {
              "display_phone_number": "phone_number",
              "phone_number_id": "phone_number_id"
            },
            "messages": [
              {
                "id": "message_id",
                "from": "sender_phone_number",
                "timestamp": "timestamp",
                "type": "text",
                "text": {
                  "body": "message_content"
                }
              }
            ]
          },
          "field": "messages"
        }
      ]
    }
  ]
}
```

## 🌐 Web 界面

启动服务器后，访问 `http://localhost:3000` 即可使用现代化的 Web 测试界面。

界面功能包括：
- 📝 发送文本消息
- 🖼️ 发送图片消息
- 📄 发送文档消息
- 🎨 发送模板消息
- 🔍 查询消息状态
- 📊 实时 API 状态监控

## 🔧 配置说明

### WhatsApp Business API 配置

1. **获取 Phone Number ID**
   - 登录 Facebook 开发者控制台
   - 进入您的 WhatsApp Business 应用
   - 在 "WhatsApp" > "Getting Started" 中找到 Phone Number ID

2. **获取 Access Token**
   - 在 "System Users" 或 "Access Tokens" 中生成永久访问令牌
   - 确保令牌具有 `whatsapp_business_messaging` 权限

3. **配置 Webhook**
   - 设置 Webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
   - 设置验证令牌 (Verify Token)
   - 订阅 `messages` 字段

### 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `WHATSAPP_API_URL` | WhatsApp API 基础URL | `https://graph.facebook.com/v18.0` |
| `WHATSAPP_PHONE_NUMBER_ID` | 您的电话号码ID | `123456789012345` |
| `WHATSAPP_ACCESS_TOKEN` | 访问令牌 | `EAAG...` |
| `WHATSAPP_VERIFY_TOKEN` | Webhook验证令牌 | `your_verify_token` |
| `PORT` | 服务器端口 | `3000` |
| `NODE_ENV` | 运行环境 | `development` 或 `production` |

## 🛡️ 安全特性

- **Helmet**: 设置安全 HTTP 头
- **CORS**: 跨域资源共享控制
- **Rate Limiting**: 请求速率限制
- **Input Validation**: 输入验证
- **Error Handling**: 统一错误处理

## 📝 使用示例

### JavaScript 客户端示例

```javascript
// 发送文本消息
const response = await fetch('/api/whatsapp/send/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    to: '1234567890@c.us',
    text: 'Hello from API!'
  })
});

const result = await response.json();
console.log(result);
```

### cURL 示例

```bash
# 发送文本消息
curl -X POST http://localhost:3000/api/whatsapp/send/text \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890@c.us",
    "text": "Hello from cURL!"
  }'

# 查询消息状态
curl http://localhost:3000/api/whatsapp/message/wamid.xxx/status
```

## 🔍 故障排除

### 常见问题

1. **API 连接失败**
   - 检查环境变量配置
   - 确认 Access Token 有效
   - 验证 Phone Number ID 正确

2. **消息发送失败**
   - 确认接收者号码格式正确 (1234567890@c.us)
   - 检查消息内容长度限制
   - 验证媒体文件URL可访问

3. **Webhook 验证失败**
   - 确认 Verify Token 配置正确
   - 检查 Webhook URL 可访问
   - 验证 SSL 证书有效

### 日志查看

```bash
# 查看实时日志
npm run dev

# 查看错误日志
tail -f logs/error.log
```

## 📚 相关文档

- [WhatsApp Business API 官方文档](https://developers.facebook.com/docs/whatsapp)
- [Facebook 开发者平台](https://developers.facebook.com/)
- [Node.js 官方文档](https://nodejs.org/docs/)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 支持

如有问题，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至: support@example.com

---

**注意**: 使用 WhatsApp Business API 需要遵守 WhatsApp 的服务条款和政策。