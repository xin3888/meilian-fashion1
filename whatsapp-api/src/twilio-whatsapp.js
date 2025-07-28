require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const multer = require('multer');

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure file upload
const upload = multer({ dest: 'uploads/' });

// Twilio webhook middleware for validation
const webhookMiddleware = twilio.webhook({
    validate: process.env.NODE_ENV === 'production'
});

// Send WhatsApp message
app.post('/api/send-message', async (req, res) => {
    try {
        const { to, body, mediaUrl } = req.body;
        
        if (!to || !body) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number and message body are required'
            });
        }
        
        // Ensure the number is in WhatsApp format
        const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        
        const messageOptions = {
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: whatsappTo,
            body: body
        };
        
        // Add media URL if provided
        if (mediaUrl) {
            messageOptions.mediaUrl = Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl];
        }
        
        const message = await client.messages.create(messageOptions);
        
        res.json({
            success: true,
            message: 'Message sent successfully',
            sid: message.sid,
            status: message.status
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send template message
app.post('/api/send-template', async (req, res) => {
    try {
        const { to, templateSid, templateData } = req.body;
        
        if (!to || !templateSid) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number and template SID are required'
            });
        }
        
        const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        
        const message = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: whatsappTo,
            contentSid: templateSid,
            contentVariables: JSON.stringify(templateData || {})
        });
        
        res.json({
            success: true,
            message: 'Template message sent successfully',
            sid: message.sid,
            status: message.status
        });
    } catch (error) {
        console.error('Error sending template message:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Webhook for incoming messages
app.post('/webhook/incoming', webhookMiddleware, (req, res) => {
    const { From, Body, MessageSid, MediaUrl0, MediaContentType0 } = req.body;
    
    console.log('Incoming message:', {
        from: From,
        body: Body,
        messageSid: MessageSid,
        hasMedia: !!MediaUrl0
    });
    
    // Process the incoming message
    handleIncomingMessage({
        from: From,
        body: Body,
        messageSid: MessageSid,
        mediaUrl: MediaUrl0,
        mediaType: MediaContentType0
    });
    
    // Send acknowledgment
    res.status(200).send('Message received');
});

// Handle incoming messages
async function handleIncomingMessage(message) {
    try {
        const { from, body } = message;
        
        // Auto-reply logic
        let replyBody = '';
        
        if (body.toLowerCase() === 'hello') {
            replyBody = 'Hi there! How can I help you today?';
        } else if (body.toLowerCase() === 'help') {
            replyBody = 'Available commands:\n' +
                       '- hello: Get a greeting\n' +
                       '- help: Show this message\n' +
                       '- info: Get information about our services';
        } else if (body.toLowerCase() === 'info') {
            replyBody = 'We provide WhatsApp API integration services. ' +
                       'Visit our website for more information!';
        }
        
        // Send auto-reply if applicable
        if (replyBody) {
            await client.messages.create({
                from: process.env.TWILIO_WHATSAPP_NUMBER,
                to: from,
                body: replyBody
            });
        }
    } catch (error) {
        console.error('Error handling incoming message:', error);
    }
}

// Get message status
app.get('/api/message-status/:sid', async (req, res) => {
    try {
        const { sid } = req.params;
        
        const message = await client.messages(sid).fetch();
        
        res.json({
            success: true,
            message: {
                sid: message.sid,
                status: message.status,
                to: message.to,
                from: message.from,
                body: message.body,
                dateSent: message.dateSent,
                dateCreated: message.dateCreated,
                errorCode: message.errorCode,
                errorMessage: message.errorMessage
            }
        });
    } catch (error) {
        console.error('Error fetching message status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// List messages
app.get('/api/messages', async (req, res) => {
    try {
        const { limit = 20, to, from } = req.query;
        
        const filters = {
            limit: parseInt(limit)
        };
        
        if (to) filters.to = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        if (from) filters.from = from.startsWith('whatsapp:') ? from : `whatsapp:${from}`;
        
        const messages = await client.messages.list(filters);
        
        res.json({
            success: true,
            messages: messages.map(msg => ({
                sid: msg.sid,
                to: msg.to,
                from: msg.from,
                body: msg.body,
                status: msg.status,
                dateSent: msg.dateSent,
                direction: msg.direction
            }))
        });
    } catch (error) {
        console.error('Error listing messages:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send location message
app.post('/api/send-location', async (req, res) => {
    try {
        const { to, latitude, longitude, label } = req.body;
        
        if (!to || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Recipient number, latitude, and longitude are required'
            });
        }
        
        const whatsappTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
        
        const message = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: whatsappTo,
            body: label || 'Location shared',
            persistentAction: [`geo:${latitude},${longitude}`]
        });
        
        res.json({
            success: true,
            message: 'Location sent successfully',
            sid: message.sid,
            status: message.status
        });
    } catch (error) {
        console.error('Error sending location:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Webhook for status updates
app.post('/webhook/status', webhookMiddleware, (req, res) => {
    const { MessageSid, MessageStatus, To, From } = req.body;
    
    console.log('Message status update:', {
        messageSid: MessageSid,
        status: MessageStatus,
        to: To,
        from: From
    });
    
    // You can implement custom logic here to handle status updates
    // For example, update your database, send notifications, etc.
    
    res.status(200).send('Status update received');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Twilio WhatsApp API server running on port ${PORT}`);
    console.log('Webhook URLs:');
    console.log(`- Incoming messages: ${process.env.WEBHOOK_URL}/webhook/incoming`);
    console.log(`- Status updates: ${process.env.WEBHOOK_URL}/webhook/status`);
});