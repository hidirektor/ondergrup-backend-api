const axios = require('axios');

const sendNotificationToAll = async ({ heading, iconType, icon, message, subtitle }) => {
    const url = 'https://api.onesignal.com/notifications?c=push';
    const data = {
        app_id: process.env.ANDROID_APP_ID, // App ID'yi çevresel değişkenden alıyoruz
        headings: { en: heading }, // Parametreden alınan başlık
        contents: { en: message }, // Parametreden alınan mesaj içeriği
        subtitle: { en: subtitle || '' }, // Parametreden alınan alt başlık (opsiyonel)
        included_segments: ['All'], // Tüm kullanıcıları hedefliyoruz
    };

    // İkon tipi ve değeri belirlenmişse, uygun alana ekleyin
    if (iconType === 'chrome_web_icon') {
        data.chrome_web_icon = icon;
    } else if (iconType === 'small_icon') {
        data.small_icon = icon;
    } else if (iconType === 'large_icon') {
        data.large_icon = icon;
    }

    const options = {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': `Basic ${process.env.ONESIGNAL_REST_API}`
        },
        data: data
    };

    try {
        const response = await axios(url, options);
        return response.data;
    } catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Notification could not be sent');
    }
};

module.exports = sendNotificationToAll;