const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const generateWelcomeEmailContent = require("../emailContent/generateWelcomeEmailContent");
const generateAlertEmailContent = require("../emailContent/generateAlertEmailContent");

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

    amqp.connect(`amqp://${process.env.RABBITMQ_USERNAME}:${process.env.RABBITMQ_PASSWORD}@85.95.231.92:${process.env.RABBITMQ_PORT}`, (error0, connection) => {
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
                    if (userInfo.type === 'welcome_emails') {
                        const mailOptions = {
                            from: process.env.SMTP_USER,
                            to: userInfo.email,
                            subject: `Sn. ${userInfo.name} ÖnderLifte Hoşgeldiniz`,
                            html: generateWelcomeEmailContent(),
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });

                    } else if (userInfo.type === 'alert_emails') {
                        const { title, desc, users } = userInfo;
                        users.forEach(user => {
                            const mailOptions = {
                                from: process.env.SMTP_USER,
                                to: user.email,
                                subject: `Sn. ${user.name}`,
                                html: generateAlertEmailContent(title, user.name, desc),
                            };

                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log(`Email sent to ${user.email}: ` + info.response);
                                }
                            });
                        });
                    }
                }, {
                    noAck: true
                });
            });
        });
    });
};

module.exports = startQueueListener;