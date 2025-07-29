require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure file upload
const upload = multer({ dest: 'uploads/' });

// WhatsApp Business API configuration
const WHATSAPP_API_URL = `https://graph.facebook.com/${process.env.WHATSAPP_API_VERSION}`;
const PHONE_NUMBER_ID = process.env.WHATSAPP_BUSINESS_PHONE_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

// Helper function to make API requests
async function makeApiRequest(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method,
            url: `${WHATSAPP_API_URL}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        };

        if (data) {
            config.data = data;
        }

        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error('API request error:', error.response?.data || error.message);
        throw error;
    }
}

// Send text message
app.post('/api/send-message', async (req, res) => {
    try {
        const { to, message, previewUrl = false } = req.body;

        if (!to || !message) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number and message are required'
            });
        }

        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: {
                preview_url: previewUrl,
                body: message
            }
        };

        const response = await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', data);

        res.json({
            success: true,
            message: 'Message sent successfully',
            messageId: response.messages[0].id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Send template message
app.post('/api/send-template', async (req, res) => {
    try {
        const { to, templateName, languageCode = 'en', components = [] } = req.body;

        if (!to || !templateName) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number and template name are required'
            });
        }

        const data = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
                name: templateName,
                language: {
                    code: languageCode
                },
                components: components
            }
        };

        const response = await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', data);

        res.json({
            success: true,
            message: 'Template message sent successfully',
            messageId: response.messages[0].id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Send media message
app.post('/api/send-media', upload.single('media'), async (req, res) => {
    try {
        const { to, type, caption } = req.body;
        const file = req.file;

        if (!to || !file) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number and media file are required'
            });
        }

        // First, upload the media file
        const FormData = require('form-data');
        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path));
        formData.append('messaging_product', 'whatsapp');

        const uploadResponse = await axios.post(
            `${WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/media`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            }
        );

        const mediaId = uploadResponse.data.id;

        // Then send the media message
        const messageData = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: type || 'image',
            [type || 'image']: {
                id: mediaId
            }
        };

        if (caption) {
            messageData[type || 'image'].caption = caption;
        }

        const response = await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', messageData);

        // Clean up uploaded file
        fs.unlinkSync(file.path);

        res.json({
            success: true,
            message: 'Media message sent successfully',
            messageId: response.messages[0].id,
            mediaId: mediaId
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Send location
app.post('/api/send-location', async (req, res) => {
    try {
        const { to, latitude, longitude, name, address } = req.body;

        if (!to || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number, latitude, and longitude are required'
            });
        }

        const data = {
            messaging_product: 'whatsapp',
            to: to,
            type: 'location',
            location: {
                longitude: longitude,
                latitude: latitude,
                name: name,
                address: address
            }
        };

        const response = await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', data);

        res.json({
            success: true,
            message: 'Location sent successfully',
            messageId: response.messages[0].id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Send interactive message (buttons)
app.post('/api/send-buttons', async (req, res) => {
    try {
        const { to, bodyText, buttons, header, footer } = req.body;

        if (!to || !bodyText || !buttons) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number, body text, and buttons are required'
            });
        }

        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'interactive',
            interactive: {
                type: 'button',
                body: {
                    text: bodyText
                },
                action: {
                    buttons: buttons.map((button, index) => ({
                        type: 'reply',
                        reply: {
                            id: button.id || `button_${index}`,
                            title: button.title
                        }
                    }))
                }
            }
        };

        if (header) {
            data.interactive.header = header;
        }

        if (footer) {
            data.interactive.footer = { text: footer };
        }

        const response = await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', data);

        res.json({
            success: true,
            message: 'Interactive message sent successfully',
            messageId: response.messages[0].id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Send interactive list message
app.post('/api/send-list', async (req, res) => {
    try {
        const { to, bodyText, buttonText, sections, header, footer } = req.body;

        if (!to || !bodyText || !buttonText || !sections) {
            return res.status(400).json({
                success: false,
                error: 'Required fields: to, bodyText, buttonText, sections'
            });
        }

        const data = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'interactive',
            interactive: {
                type: 'list',
                body: {
                    text: bodyText
                },
                action: {
                    button: buttonText,
                    sections: sections
                }
            }
        };

        if (header) {
            data.interactive.header = header;
        }

        if (footer) {
            data.interactive.footer = { text: footer };
        }

        const response = await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', data);

        res.json({
            success: true,
            message: 'List message sent successfully',
            messageId: response.messages[0].id
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Webhook verification (for Facebook)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.status(403).send('Forbidden');
        }
    } else {
        res.status(400).send('Bad Request');
    }
});

// Webhook for incoming messages
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        body.entry.forEach(entry => {
            const changes = entry.changes;
            changes.forEach(change => {
                const value = change.value;
                
                if (value.messages) {
                    value.messages.forEach(message => {
                        handleIncomingMessage({
                            from: message.from,
                            id: message.id,
                            timestamp: message.timestamp,
                            type: message.type,
                            text: message.text?.body,
                            ...message
                        });
                    });
                }

                if (value.statuses) {
                    value.statuses.forEach(status => {
                        handleMessageStatus(status);
                    });
                }
            });
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).send('Not Found');
    }
});

// Handle incoming messages
async function handleIncomingMessage(message) {
    console.log('Incoming message:', message);

    // Auto-reply logic
    if (message.type === 'text') {
        const text = message.text.toLowerCase();
        let replyText = '';

        if (text === 'hello' || text === 'hi') {
            replyText = 'Hello! Welcome to our WhatsApp Business API service. How can I help you today?';
        } else if (text === 'help') {
            replyText = 'Available commands:\n' +
                       '• hello - Get a greeting\n' +
                       '• help - Show this message\n' +
                       '• info - Learn about our services\n' +
                       '• contact - Get our contact information';
        } else if (text === 'info') {
            replyText = 'We provide professional WhatsApp Business API integration services. ' +
                       'Our API supports text messages, media, templates, and interactive messages.';
        } else if (text === 'contact') {
            replyText = 'You can reach us at:\n' +
                       '📧 Email: support@example.com\n' +
                       '🌐 Website: www.example.com\n' +
                       '📱 Phone: +1234567890';
        }

        if (replyText) {
            try {
                await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', {
                    messaging_product: 'whatsapp',
                    to: message.from,
                    type: 'text',
                    text: { body: replyText }
                });
            } catch (error) {
                console.error('Error sending auto-reply:', error);
            }
        }
    }
}

// Handle message status updates
function handleMessageStatus(status) {
    console.log('Message status update:', {
        id: status.id,
        status: status.status,
        timestamp: status.timestamp,
        recipient: status.recipient_id
    });

    // You can implement custom logic here
    // For example, update your database, send notifications, etc.
}

// Get message templates
app.get('/api/templates', async (req, res) => {
    try {
        const response = await makeApiRequest(`/${process.env.WHATSAPP_BUSINESS_ID}/message_templates`);

        res.json({
            success: true,
            templates: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Mark message as read
app.post('/api/mark-read', async (req, res) => {
    try {
        const { messageId } = req.body;

        if (!messageId) {
            return res.status(400).json({
                success: false,
                error: 'Message ID is required'
            });
        }

        const response = await makeApiRequest(`/${PHONE_NUMBER_ID}/messages`, 'POST', {
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: messageId
        });

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.error?.message || error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`WhatsApp Business API server running on port ${PORT}`);
    console.log('Webhook URL:', `${process.env.WEBHOOK_URL}/webhook`);
});