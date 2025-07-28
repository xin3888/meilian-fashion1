require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'WhatsApp API Server',
        version: '1.0.0',
        endpoints: {
            whatsappWeb: {
                status: 'Available',
                description: 'Unofficial WhatsApp Web integration',
                docs: '/api/whatsapp-web/docs'
            },
            twilio: {
                status: 'Requires Configuration',
                description: 'Official Twilio WhatsApp API',
                docs: '/api/twilio/docs'
            },
            businessAPI: {
                status: 'Requires Configuration',
                description: 'Official Meta WhatsApp Business API',
                docs: '/api/business/docs'
            }
        },
        quickStart: {
            step1: 'Copy .env.example to .env',
            step2: 'Configure your credentials',
            step3: 'Run: npm run whatsapp-web (easiest to start)',
            step4: 'Scan QR code with WhatsApp mobile'
        }
    });
});

// API documentation endpoints
app.get('/api/whatsapp-web/docs', (req, res) => {
    res.json({
        name: 'WhatsApp Web JS API',
        description: 'Unofficial but easy to use WhatsApp integration',
        setup: 'No approval needed, just scan QR code',
        endpoints: [
            {
                method: 'POST',
                path: '/api/send-message',
                description: 'Send text message',
                body: {
                    number: 'string (with country code)',
                    message: 'string'
                }
            },
            {
                method: 'POST',
                path: '/api/send-media',
                description: 'Send media file',
                body: 'multipart/form-data with number, caption, and media file'
            },
            {
                method: 'GET',
                path: '/api/chats',
                description: 'Get all chats'
            },
            {
                method: 'GET',
                path: '/api/contacts',
                description: 'Get all contacts'
            },
            {
                method: 'POST',
                path: '/api/create-group',
                description: 'Create WhatsApp group',
                body: {
                    name: 'string',
                    participants: 'array of phone numbers'
                }
            }
        ]
    });
});

app.get('/api/twilio/docs', (req, res) => {
    res.json({
        name: 'Twilio WhatsApp API',
        description: 'Official Twilio integration for WhatsApp',
        setup: 'Requires Twilio account and WhatsApp approval',
        endpoints: [
            {
                method: 'POST',
                path: '/api/send-message',
                description: 'Send message via Twilio',
                body: {
                    to: 'string (phone number)',
                    body: 'string',
                    mediaUrl: 'string (optional)'
                }
            },
            {
                method: 'POST',
                path: '/api/send-template',
                description: 'Send template message',
                body: {
                    to: 'string',
                    templateSid: 'string',
                    templateData: 'object'
                }
            },
            {
                method: 'GET',
                path: '/api/messages',
                description: 'List sent/received messages'
            }
        ]
    });
});

app.get('/api/business/docs', (req, res) => {
    res.json({
        name: 'WhatsApp Business API',
        description: 'Official Meta/Facebook WhatsApp Business API',
        setup: 'Requires Facebook Business verification and approval',
        endpoints: [
            {
                method: 'POST',
                path: '/api/send-message',
                description: 'Send text message',
                body: {
                    to: 'string',
                    message: 'string'
                }
            },
            {
                method: 'POST',
                path: '/api/send-template',
                description: 'Send approved template',
                body: {
                    to: 'string',
                    templateName: 'string',
                    languageCode: 'string',
                    components: 'array'
                }
            },
            {
                method: 'POST',
                path: '/api/send-buttons',
                description: 'Send interactive button message',
                body: {
                    to: 'string',
                    bodyText: 'string',
                    buttons: 'array'
                }
            }
        ]
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`WhatsApp API Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} for documentation`);
    console.log('\nTo start a specific implementation:');
    console.log('- WhatsApp Web: npm run whatsapp-web');
    console.log('- Twilio: npm run twilio');
    console.log('- Business API: npm run business-api');
});