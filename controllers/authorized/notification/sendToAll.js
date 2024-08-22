const sendNotificationToAll = require('../../../helpers/onesignal/sendNotificationToAll');

module.exports = async (req, res) => {
    const { heading, iconType, icon, message, subtitle } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required.' });
    }

    if (!heading) {
        return res.status(400).json({ message: 'Heading is required.' });
    }

    if (!iconType || !icon) {
        return res.status(400).json({ message: 'Icon type and icon URL are required.' });
    }

    try {
        const response = await sendNotificationToAll({ heading, iconType, icon, message, subtitle });
        res.json({
            message: 'Notification sent to all users successfully',
            data: response
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to send notification',
            error: error.message
        });
    }
};