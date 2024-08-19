const amqp = require('amqplib/callback_api');

const sendMail = async (type, userEmail, nameSurname = null) => {
    amqp.connect('amqp://rabbitmqadminonder:rabbitmq1456@85.95.231.92:5672', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            const queue = type === 'welcomeMail' ? 'welcome_emails' : 'alert_emails';
            const msg = JSON.stringify({ type, email: userEmail, name: nameSurname });

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(msg));

            console.log(" [x] Sent '%s' to queue: %s", msg, queue);
        });

        setTimeout(() => {
            connection.close();
        }, 500);
    });
};

module.exports = sendMail;