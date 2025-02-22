const admin = require('firebase-admin');

// Initialize Firebase Admin (ensure serviceAccountKey.json is correctly set up)
const serviceAccount = require('../config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

/**
 * Send a notification via Firebase Cloud Messaging
 * @param {string | string[]} tokens - Device token(s) to send notification to
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} [data={}] - Additional data payload (optional)
 * @returns {Promise<object>} - Firebase response
 */
async function sendNotification(tokens, title, body, data = {}) {
    if (!tokens || (Array.isArray(tokens) && tokens.length === 0)) {
        throw new Error('Device token(s) required');
    }

    const message = {
        notification: { title, body },
        data, // Custom data payload
        tokens: Array.isArray(tokens) ? tokens : [tokens] // Ensure tokens is an array
    };

    try {
        const response = await admin.messaging().sendEachForMulticast(message);
        console.log('Notification sent:', response);
        return response;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw error;
    }
}

module.exports = { sendNotification };
