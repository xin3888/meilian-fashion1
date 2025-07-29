# WhatsApp API Integration

This project provides multiple implementations for integrating with WhatsApp:

1. **WhatsApp Web JS** - Unofficial but popular library using WhatsApp Web
2. **Twilio WhatsApp API** - Official Twilio integration
3. **WhatsApp Business API** - Official Meta/Facebook Business API

## 🚀 Quick Start

### Installation

```bash
cd whatsapp-api
npm install
```

### Configuration

1. Copy the environment variables file:
```bash
cp .env.example .env
```

2. Configure your credentials in `.env`:
   - For WhatsApp Web JS: No credentials needed
   - For Twilio: Add your Account SID and Auth Token
   - For Business API: Add your Phone ID and Access Token

## 📱 WhatsApp Web JS (Recommended for Quick Start)

The easiest way to get started without any approval process.

### Start the server:
```bash
npm run whatsapp-web
```

### Features:
- ✅ Send text messages
- ✅ Send media (images, documents, audio, video)
- ✅ Receive messages
- ✅ Create groups
- ✅ Get contacts and chats
- ✅ Send locations
- ✅ Auto-reply functionality

### First Time Setup:
1. Run the server
2. Scan the QR code with WhatsApp mobile
3. Your session will be saved for future use

### API Endpoints:

#### Send Text Message
```bash
POST /api/send-message
{
  "number": "+1234567890",
  "message": "Hello from WhatsApp API!"
}
```

#### Send Media
```bash
POST /api/send-media
Content-Type: multipart/form-data

number: +1234567890
caption: Check this out!
media: [file]
```

#### Get Chats
```bash
GET /api/chats
```

#### Get Contacts
```bash
GET /api/contacts
```

## 💼 Twilio WhatsApp API

Official Twilio integration for business use.

### Setup:
1. Create a Twilio account
2. Get WhatsApp approved number or use sandbox
3. Configure webhooks in Twilio console
4. Add credentials to `.env`

### Start the server:
```bash
npm run twilio
```

### Features:
- ✅ Send messages via official API
- ✅ Template messages
- ✅ Media messages
- ✅ Webhook for incoming messages
- ✅ Message status tracking

### API Endpoints:

#### Send Message
```bash
POST /api/send-message
{
  "to": "+1234567890",
  "body": "Hello from Twilio!",
  "mediaUrl": "https://example.com/image.jpg" // optional
}
```

## 🏢 WhatsApp Business API (Official Meta API)

The official API from Meta for large-scale business use.

### Requirements:
- Facebook Business verification
- WhatsApp Business Account
- Phone number verification
- Message template approval

### Start the server:
```bash
npm run business-api
```

### Features:
- ✅ Template messages
- ✅ Interactive messages (buttons, lists)
- ✅ Media messages
- ✅ Location sharing
- ✅ Webhook integration
- ✅ Message status updates

### API Endpoints:

#### Send Template
```bash
POST /api/send-template
{
  "to": "+1234567890",
  "templateName": "hello_world",
  "languageCode": "en_US",
  "components": []
}
```

#### Send Interactive Buttons
```bash
POST /api/send-buttons
{
  "to": "+1234567890",
  "bodyText": "Please select an option:",
  "buttons": [
    {"id": "yes", "title": "Yes"},
    {"id": "no", "title": "No"}
  ]
}
```

## 📝 Examples

Run example scripts:

```bash
# WhatsApp Web examples
node examples/send-message.js

# Business API examples
node examples/business-api-examples.js
```

## 🔧 Development

### Project Structure:
```
whatsapp-api/
├── src/
│   ├── whatsapp-web.js      # WhatsApp Web implementation
│   ├── twilio-whatsapp.js   # Twilio implementation
│   └── business-api.js      # Meta Business API
├── examples/
│   ├── send-message.js      # Basic examples
│   └── business-api-examples.js
├── config/
├── package.json
├── .env.example
└── README.md
```

### Running in Development:
```bash
npm run dev
```

## ⚡ Comparison

| Feature | WhatsApp Web JS | Twilio | Business API |
|---------|----------------|---------|--------------|
| Setup Difficulty | Easy | Medium | Hard |
| Official Support | ❌ | ✅ | ✅ |
| Cost | Free | Pay per message | Pay per message |
| Message Templates | ❌ | ✅ | ✅ |
| Scale | Small | Medium | Large |
| Approval Required | No | Yes | Yes |

## 🛡️ Security Notes

1. Never commit `.env` file
2. Use HTTPS in production
3. Validate webhook signatures
4. Rate limit your endpoints
5. Sanitize user inputs

## 📚 Resources

- [WhatsApp Web JS Docs](https://wwebjs.dev/)
- [Twilio WhatsApp Docs](https://www.twilio.com/docs/whatsapp)
- [Meta WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

## 🤝 Support

For issues or questions:
1. Check the examples folder
2. Review API documentation
3. Check environment variables
4. Verify webhook configuration

## 📄 License

MIT License - feel free to use in your projects!