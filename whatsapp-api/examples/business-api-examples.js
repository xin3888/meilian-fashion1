const axios = require('axios');

const API_URL = 'http://localhost:3000';

// Example: Send template message
async function sendTemplateMessage() {
    try {
        const response = await axios.post(`${API_URL}/api/send-template`, {
            to: '+1234567890',
            templateName: 'hello_world',
            languageCode: 'en_US',
            components: [
                {
                    type: 'body',
                    parameters: [
                        {
                            type: 'text',
                            text: 'John Doe'
                        }
                    ]
                }
            ]
        });
        
        console.log('Template message sent:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Example: Send interactive button message
async function sendButtonMessage() {
    try {
        const response = await axios.post(`${API_URL}/api/send-buttons`, {
            to: '+1234567890',
            bodyText: 'Please select an option:',
            buttons: [
                {
                    id: 'yes',
                    title: 'Yes'
                },
                {
                    id: 'no',
                    title: 'No'
                },
                {
                    id: 'maybe',
                    title: 'Maybe'
                }
            ],
            header: {
                type: 'text',
                text: 'Quick Question'
            },
            footer: 'Reply with your choice'
        });
        
        console.log('Button message sent:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Example: Send interactive list message
async function sendListMessage() {
    try {
        const response = await axios.post(`${API_URL}/api/send-list`, {
            to: '+1234567890',
            bodyText: 'Please select from our menu:',
            buttonText: 'View Menu',
            sections: [
                {
                    title: 'Appetizers',
                    rows: [
                        {
                            id: 'app1',
                            title: 'Spring Rolls',
                            description: 'Crispy vegetable spring rolls'
                        },
                        {
                            id: 'app2',
                            title: 'Soup',
                            description: 'Hot and sour soup'
                        }
                    ]
                },
                {
                    title: 'Main Courses',
                    rows: [
                        {
                            id: 'main1',
                            title: 'Grilled Chicken',
                            description: 'Served with vegetables'
                        },
                        {
                            id: 'main2',
                            title: 'Pasta',
                            description: 'Italian style pasta'
                        }
                    ]
                }
            ],
            header: {
                type: 'text',
                text: 'Restaurant Menu'
            },
            footer: 'Prices available upon request'
        });
        
        console.log('List message sent:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Example: Mark message as read
async function markMessageAsRead(messageId) {
    try {
        const response = await axios.post(`${API_URL}/api/mark-read`, {
            messageId: messageId
        });
        
        console.log('Message marked as read:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Run examples
async function runBusinessAPIExamples() {
    console.log('Running WhatsApp Business API examples...\n');
    
    // Note: These examples require proper WhatsApp Business API setup
    // with verified phone number and approved templates
    
    console.log('1. Sending template message...');
    await sendTemplateMessage();
    
    console.log('\n2. Sending button message...');
    await sendButtonMessage();
    
    console.log('\n3. Sending list message...');
    await sendListMessage();
}

// Export functions for use in other modules
module.exports = {
    sendTemplateMessage,
    sendButtonMessage,
    sendListMessage,
    markMessageAsRead
};

// Run if called directly
if (require.main === module) {
    runBusinessAPIExamples();
}