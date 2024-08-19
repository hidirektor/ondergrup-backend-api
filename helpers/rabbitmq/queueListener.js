const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const generateWelcomeEmailContent = require("../emailContent/generateWelcomeEmailContent");

const startQueueListener = () => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    amqp.connect('amqp://rabbitmqadminonder:rabbitmq1456@85.95.231.92:5672', (error0, connection) => {
        if (error0) {
            throw error0;
        }
        connection.createChannel((error1, channel) => {
            if (error1) {
                throw error1;
            }

            const queues = ['welcome_emails', 'alert_emails'];

            queues.forEach(queue => {
                channel.assertQueue(queue, {
                    durable: false
                });

                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

                channel.consume(queue, (msg) => {
                    const userInfo = JSON.parse(msg.content.toString());
                    const mailOptions = {
                        from: process.env.SMTP_USER,
                        to: userInfo.email,
                        subject: '',
                        html: '',
                    };

                    if (userInfo.type === 'welcomeMail') {
                        mailOptions.subject = `Sn. ${userInfo.name} ÖnderLifte Hoşgeldiniz`;
                        mailOptions.html = generateWelcomeEmailContent();
                    } else if (userInfo.type === 'alertMail') {
                        mailOptions.subject = 'Important System Alert';
                        mailOptions.text = `Dear user,\n\nThis is an important system alert.\n\nBest regards,\nThe Team`;
                    }

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }, {
                    noAck: true
                });
            });
        });
    });
};

module.exports = startQueueListener;