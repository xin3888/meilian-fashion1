const { Client, LocalAuth, MessageMedia, Location } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure file upload
const upload = multer({ dest: 'uploads/' });

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'whatsapp-sessions'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Generate QR code
client.on('qr', (qr) => {
    console.log('QR Code received, scan it with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Client ready
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Message received
client.on('message', async (message) => {
    console.log(`Message from ${message.from}: ${message.body}`);
    
    // Auto-reply example
    if (message.body.toLowerCase() === 'ping') {
        await message.reply('pong');
    }
    
    // Echo message
    if (message.body.startsWith('echo ')) {
        const echoText = message.body.slice(5);
        await message.reply(`Echo: ${echoText}`);
    }
});

// API Endpoints

// Send text message
app.post('/api/send-message', async (req, res) => {
    try {
        const { number, message } = req.body;
        
        if (!number || !message) {
            return res.status(400).json({
                success: false,
                error: 'Number and message are required'
            });
        }
        
        // Format number (add country code if not present)
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        
        const response = await client.sendMessage(chatId, message);
        
        res.json({
            success: true,
            message: 'Message sent successfully',
            messageId: response.id
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send media message
app.post('/api/send-media', upload.single('media'), async (req, res) => {
    try {
        const { number, caption } = req.body;
        const file = req.file;
        
        if (!number || !file) {
            return res.status(400).json({
                success: false,
                error: 'Number and media file are required'
            });
        }
        
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        
        // Create media from file
        const media = MessageMedia.fromFilePath(file.path);
        
        const response = await client.sendMessage(chatId, media, {
            caption: caption || ''
        });
        
        // Clean up uploaded file
        fs.unlinkSync(file.path);
        
        res.json({
            success: true,
            message: 'Media sent successfully',
            messageId: response.id
        });
    } catch (error) {
        console.error('Error sending media:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get all chats
app.get('/api/chats', async (req, res) => {
    try {
        const chats = await client.getChats();
        
        const chatList = chats.map(chat => ({
            id: chat.id._serialized,
            name: chat.name,
            isGroup: chat.isGroup,
            unreadCount: chat.unreadCount,
            lastMessage: chat.lastMessage?.body
        }));
        
        res.json({
            success: true,
            chats: chatList
        });
    } catch (error) {
        console.error('Error getting chats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await client.getContacts();
        
        const contactList = contacts.map(contact => ({
            id: contact.id._serialized,
            name: contact.name || contact.pushname,
            number: contact.number,
            isMyContact: contact.isMyContact
        }));
        
        res.json({
            success: true,
            contacts: contactList
        });
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Send location
app.post('/api/send-location', async (req, res) => {
    try {
        const { number, latitude, longitude, description } = req.body;
        
        if (!number || !latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Number, latitude, and longitude are required'
            });
        }
        
        const chatId = number.includes('@c.us') ? number : `${number}@c.us`;
        
        const location = new Location(latitude, longitude, description);
        const response = await client.sendMessage(chatId, location);
        
        res.json({
            success: true,
            message: 'Location sent successfully',
            messageId: response.id
        });
    } catch (error) {
        console.error('Error sending location:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create group
app.post('/api/create-group', async (req, res) => {
    try {
        const { name, participants } = req.body;
        
        if (!name || !participants || !Array.isArray(participants)) {
            return res.status(400).json({
                success: false,
                error: 'Group name and participants array are required'
            });
        }
        
        const participantIds = participants.map(p => 
            p.includes('@c.us') ? p : `${p}@c.us`
        );
        
        const group = await client.createGroup(name, participantIds);
        
        res.json({
            success: true,
            message: 'Group created successfully',
            groupId: group.gid._serialized
        });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Initialize client
client.initialize();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`WhatsApp Web API server running on port ${PORT}`);
    console.log('Initializing WhatsApp client...');
});