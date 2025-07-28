# 🚀 WhatsApp API 快速启动指南

## 5分钟快速开始

### 1. 自动设置 (推荐)
```bash
npm run setup
```
这个命令会引导您完成所有配置步骤。

### 2. 手动设置

#### 步骤 1: 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入您的 WhatsApp Business API 信息：
```env
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_access_token
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token
PORT=3000
NODE_ENV=development
```

#### 步骤 2: 启动服务器
```bash
npm run dev
```

#### 步骤 3: 访问 Web 界面
打开浏览器访问: http://localhost:3000

## 📱 WhatsApp Business API 配置

### 获取 API 凭据

1. **访问 Facebook 开发者平台**
   - 前往 https://developers.facebook.com/
   - 创建或登录您的开发者账户

2. **创建 WhatsApp Business 应用**
   - 点击 "创建应用"
   - 选择 "业务" 类型
   - 添加 "WhatsApp" 产品

3. **获取 Phone Number ID**
   - 在 WhatsApp > Getting Started 页面
   - 找到您的 Phone Number ID

4. **生成 Access Token**
   - 在 "系统用户" 或 "访问令牌" 中
   - 生成永久访问令牌
   - 确保具有 `whatsapp_business_messaging` 权限

5. **配置 Webhook**
   - Webhook URL: `https://yourdomain.com/api/whatsapp/webhook`
   - 验证令牌: 设置一个自定义令牌
   - 订阅字段: `messages`

## 🧪 测试 API

### 使用 Web 界面
1. 访问 http://localhost:3000
2. 选择要测试的功能
3. 填入测试数据
4. 点击发送按钮

### 使用命令行
```bash
# 运行完整测试套件
npm test

# 健康检查
curl http://localhost:3000/api/whatsapp/health

# 发送文本消息
curl -X POST http://localhost:3000/api/whatsapp/send/text \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890@c.us",
    "text": "Hello from API!"
  }'
```

## 🔧 常用命令

```bash
# 开发模式启动
npm run dev

# 生产模式启动
npm start

# 运行测试
npm test

# 项目设置
npm run setup

# 代码格式化
npm run format
```

## 📋 检查清单

在开始使用前，请确保：

- [ ] Node.js 16+ 已安装
- [ ] WhatsApp Business API 账户已创建
- [ ] Phone Number ID 已获取
- [ ] Access Token 已生成
- [ ] Webhook 已配置
- [ ] .env 文件已正确配置
- [ ] 依赖已安装 (`npm install`)
- [ ] 服务器已启动 (`npm run dev`)

## 🆘 常见问题

### Q: 如何获取 WhatsApp Business API 账户？
A: 访问 https://developers.facebook.com/ 创建开发者账户，然后添加 WhatsApp 产品。

### Q: 消息发送失败怎么办？
A: 检查以下几点：
- 环境变量配置是否正确
- Access Token 是否有效
- 电话号码格式是否正确 (1234567890@c.us)
- 是否在24小时窗口内发送过消息

### Q: Webhook 验证失败？
A: 确保：
- Webhook URL 可公开访问
- 验证令牌与 .env 文件中的一致
- SSL 证书有效

### Q: 如何测试 Webhook？
A: 使用 ngrok 等工具将本地服务器暴露到公网：
```bash
ngrok http 3000
```

## 📞 获取帮助

- 📖 查看完整文档: README.md
- 🐛 报告问题: 创建 GitHub Issue
- 💬 社区支持: 加入我们的 Discord 频道

---

**提示**: 首次使用建议先运行 `npm run setup` 进行自动配置！