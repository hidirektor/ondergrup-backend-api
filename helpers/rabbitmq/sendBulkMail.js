const amqp = require('amqplib/callback_api');

const sendBulkMail = (title, desc, userEmails) => {
    return new Promise((resolve, reject) => {
        amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@85.95.231.92:${process.env.RABBITMQ_PORT}`, (error0, connection) => {
            if (error0) {
                return reject(error0);
            }

            connection.createChannel((error1, channel) => {
                if (error1) {
                    return reject(error1);
                }

                const queue = 'alert_emails';
                const msg = JSON.stringify({ type: queue, title, desc, users: userEmails });

                channel.assertQueue(queue, {
                    durable: false
                });

                channel.sendToQueue(queue, Buffer.from(msg));

                console.log(" [x] Sent '%s' to queue: %s", msg, queue);

                setTimeout(() => {
                    connection.close();
                    resolve();
                }, 500);
            });
        });
    });
};

module.exports = sendBulkMail;