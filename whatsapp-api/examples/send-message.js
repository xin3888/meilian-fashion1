const axios = require('axios');

// Example: Send text message using WhatsApp Web API
async function sendTextMessage() {
    try {
        const response = await axios.post('http://localhost:3000/api/send-message', {
            number: '+1234567890', // Replace with recipient's number
            message: 'Hello from WhatsApp API!'
        });
        
        console.log('Message sent:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Example: Send media message
async function sendMediaMessage() {
    const FormData = require('form-data');
    const fs = require('fs');
    
    const form = new FormData();
    form.append('number', '+1234567890');
    form.append('caption', 'Check out this image!');
    form.append('media', fs.createReadStream('path/to/image.jpg'));
    
    try {
        const response = await axios.post(
            'http://localhost:3000/api/send-media',
            form,
            { headers: form.getHeaders() }
        );
        
        console.log('Media sent:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Example: Send location
async function sendLocation() {
    try {
        const response = await axios.post('http://localhost:3000/api/send-location', {
            number: '+1234567890',
            latitude: 37.7749,
            longitude: -122.4194,
            description: 'San Francisco, CA'
        });
        
        console.log('Location sent:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Example: Create group
async function createGroup() {
    try {
        const response = await axios.post('http://localhost:3000/api/create-group', {
            name: 'My WhatsApp Group',
            participants: ['+1234567890', '+0987654321']
        });
        
        console.log('Group created:', response.data);
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

// Run examples
async function runExamples() {
    console.log('Sending text message...');
    await sendTextMessage();
    
    // Uncomment to run other examples
    // await sendMediaMessage();
    // await sendLocation();
    // await createGroup();
}

runExamples();