const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const logger = require('../utils/logger');
const messageHandler = require('../handlers/messageHandler');

// Webhook verification
router.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      logger.info('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      logger.warn('Webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Webhook endpoint for receiving messages
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    // Verify webhook signature (optional but recommended)
    if (process.env.WEBHOOK_SECRET) {
      const signature = req.headers['x-hub-signature-256'];
      if (!verifyWebhookSignature(JSON.stringify(body), signature)) {
        logger.warn('Invalid webhook signature');
        return res.sendStatus(403);
      }
    }

    // Process webhook data
    if (body.object === 'whatsapp_business_account') {
      body.entry?.forEach(async (entry) => {
        const changes = entry.changes;
        
        changes?.forEach(async (change) => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            const contacts = change.value.contacts;
            const statuses = change.value.statuses;

            // Handle incoming messages
            if (messages) {
              await messageHandler.handleIncomingMessages(messages, contacts);
            }

            // Handle message status updates
            if (statuses) {
              await messageHandler.handleStatusUpdates(statuses);
            }
          }
        });
      });
    }

    res.sendStatus(200);
  } catch (error) {
    logger.error('Error processing webhook:', error);
    res.sendStatus(500);
  }
});

// Function to verify webhook signature
function verifyWebhookSignature(payload, signature) {
  if (!signature) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(payload, 'utf8')
    .digest('hex');
  
  const actualSignature = signature.replace('sha256=', '');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(actualSignature, 'hex')
  );
}

module.exports = router;