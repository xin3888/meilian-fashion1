# WhatsApp API 使用示例

本文档提供了WhatsApp Business API的详细使用示例。

## 基础配置

首先确保您已经正确配置了环境变量和API密钥。

### JavaScript示例

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api/whatsapp';
const API_KEY = 'your_secret_key';

const whatsappAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
  }
});
```

## 1. 发送简单文本消息

```javascript
async function sendTextMessage() {
  try {
    const response = await whatsappAPI.post('/send-message', {
      to: '1234567890',
      message: '你好！欢迎使用我们的WhatsApp服务。',
      type: 'text'
    });
    
    console.log('消息发送成功:', response.data);
  } catch (error) {
    console.error('发送失败:', error.response.data);
  }
}
```

### cURL示例

```bash
curl -X POST http://localhost:3000/api/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_secret_key" \
  -d '{
    "to": "1234567890",
    "message": "Hello from WhatsApp API!",
    "type": "text"
  }'
```

## 2. 发送图片消息

```javascript
async function sendImageMessage() {
  try {
    const response = await whatsappAPI.post('/send-media', {
      to: '1234567890',
      mediaUrl: 'https://example.com/image.jpg',
      mediaType: 'image',
      caption: '这是一张产品图片！'
    });
    
    console.log('图片发送成功:', response.data);
  } catch (error) {
    console.error('发送失败:', error.response.data);
  }
}
```

## 3. 发送文档

```javascript
async function sendDocument() {
  try {
    const response = await whatsappAPI.post('/send-media', {
      to: '1234567890',
      mediaUrl: 'https://example.com/catalog.pdf',
      mediaType: 'document',
      caption: '产品目录PDF'
    });
    
    console.log('文档发送成功:', response.data);
  } catch (error) {
    console.error('发送失败:', error.response.data);
  }
}
```

## 4. 发送模板消息

```javascript
async function sendTemplateMessage() {
  try {
    const response = await whatsappAPI.post('/send-template', {
      to: '1234567890',
      templateName: 'order_confirmation',
      language: 'zh_CN',
      parameters: ['张三', 'ORD12345', '￥299.00']
    });
    
    console.log('模板消息发送成功:', response.data);
  } catch (error) {
    console.error('发送失败:', error.response.data);
  }
}
```

## 5. 发送交互式按钮消息

```javascript
// 注意：这个功能需要在whatsappService中添加相应方法
async function sendButtonMessage() {
  try {
    // 这需要扩展现有的API端点
    const response = await whatsappAPI.post('/send-button', {
      to: '1234567890',
      text: '您想了解什么信息？',
      buttons: ['产品信息', '价格咨询', '联系客服']
    });
    
    console.log('按钮消息发送成功:', response.data);
  } catch (error) {
    console.error('发送失败:', error.response.data);
  }
}
```

## 6. 批量发送消息

```javascript
async function sendBulkMessages() {
  const recipients = ['1234567890', '0987654321', '1122334455'];
  const message = '重要通知：我们的服务将在今晚进行维护，预计持续2小时。';
  
  const promises = recipients.map(phoneNumber => 
    whatsappAPI.post('/send-message', {
      to: phoneNumber,
      message: message,
      type: 'text'
    })
  );
  
  try {
    const results = await Promise.allSettled(promises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`消息发送成功到 ${recipients[index]}`);
      } else {
        console.error(`发送失败到 ${recipients[index]}:`, result.reason);
      }
    });
  } catch (error) {
    console.error('批量发送出错:', error);
  }
}
```

## 7. 检查消息状态

```javascript
async function checkMessageStatus(messageId) {
  try {
    const response = await whatsappAPI.get(`/message-status/${messageId}`);
    console.log('消息状态:', response.data);
  } catch (error) {
    console.error('获取状态失败:', error.response.data);
  }
}
```

## 8. 获取业务资料

```javascript
async function getBusinessProfile() {
  try {
    const response = await whatsappAPI.get('/business-profile');
    console.log('业务资料:', response.data);
  } catch (error) {
    console.error('获取资料失败:', error.response.data);
  }
}
```

## Python示例

```python
import requests
import json

API_BASE_URL = 'http://localhost:3000/api/whatsapp'
API_KEY = 'your_secret_key'

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY
}

def send_text_message(to, message):
    payload = {
        'to': to,
        'message': message,
        'type': 'text'
    }
    
    response = requests.post(
        f'{API_BASE_URL}/send-message',
        headers=headers,
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        print('消息发送成功:', response.json())
    else:
        print('发送失败:', response.json())

# 使用示例
send_text_message('1234567890', '你好，这是来自Python的消息！')
```

## PHP示例

```php
<?php
$apiBaseUrl = 'http://localhost:3000/api/whatsapp';
$apiKey = 'your_secret_key';

function sendTextMessage($to, $message) {
    global $apiBaseUrl, $apiKey;
    
    $payload = [
        'to' => $to,
        'message' => $message,
        'type' => 'text'
    ];
    
    $options = [
        'http' => [
            'header' => [
                'Content-Type: application/json',
                'X-API-Key: ' . $apiKey
            ],
            'method' => 'POST',
            'content' => json_encode($payload)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($apiBaseUrl . '/send-message', false, $context);
    
    if ($result !== FALSE) {
        echo '消息发送成功: ' . $result;
    } else {
        echo '发送失败';
    }
}

// 使用示例
sendTextMessage('1234567890', '你好，这是来自PHP的消息！');
?>
```

## 错误处理最佳实践

```javascript
async function sendMessageWithRetry(to, message, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await whatsappAPI.post('/send-message', {
        to: to,
        message: message,
        type: 'text'
      });
      
      console.log('消息发送成功:', response.data);
      return response.data;
      
    } catch (error) {
      console.error(`尝试 ${attempt} 失败:`, error.response?.data || error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`发送消息失败，已重试 ${maxRetries} 次`);
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
}
```

## Webhook处理示例

如果您需要处理来自WhatsApp的webhook，这里是一个简单的Express服务器示例：

```javascript
const express = require('express');
const app = express();

app.use(express.json());

// 处理来自WhatsApp的消息
app.post('/my-webhook', (req, res) => {
  const body = req.body;
  
  if (body.object === 'whatsapp_business_account') {
    body.entry?.forEach(entry => {
      const changes = entry.changes;
      
      changes?.forEach(change => {
        if (change.field === 'messages') {
          const messages = change.value.messages;
          
          messages?.forEach(message => {
            console.log('收到消息:', {
              from: message.from,
              type: message.type,
              content: message.text?.body || '非文本消息'
            });
            
            // 在这里处理收到的消息
            handleIncomingMessage(message);
          });
        }
      });
    });
  }
  
  res.sendStatus(200);
});

function handleIncomingMessage(message) {
  // 自定义消息处理逻辑
  if (message.type === 'text') {
    const text = message.text.body.toLowerCase();
    
    if (text.includes('帮助')) {
      // 发送帮助信息
      sendHelpMessage(message.from);
    }
  }
}

app.listen(3001, () => {
  console.log('Webhook服务器运行在端口3001');
});
```

## 注意事项

1. **电话号码格式**：确保电话号码包含国家代码，不包含"+"号
2. **媒体URL**：媒体文件必须是公开可访问的URL
3. **速率限制**：WhatsApp有消息发送频率限制，请合理控制发送速度
4. **模板消息**：模板需要先在Facebook Business Manager中审核通过
5. **Webhook验证**：确保Webhook URL可以从外网访问