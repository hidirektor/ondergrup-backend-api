const nodemailer = require('nodemailer');
const path = require('path');
const Minio = require('minio');
const { v4: uuidv4 } = require('uuid');

const minioClient = new Minio.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
    useSSL: false,
});

const sendErrorReport = async (req, res) => {
    try {
        const { errorTitle, errorDesc } = req.body;
        const files = [];

        for (let i = 0; i <= 6; i++) {
            if (req.files[`attachment${i}`]) {
                files.push(...req.files[`attachment${i}`]);
            }
        }

        if (!errorTitle || !errorDesc) {
            return res.status(400).json({ message: 'errorTitle and errorDesc are required' });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: 'recep@onderlift.com, hidirektor@gmail.com',
            subject: `Bug Report: ${errorTitle}`,
            text: errorDesc,
            attachments: [] // Initialize an empty array for file attachments
        };

        for (let file of files) {
            const fileID = uuidv4();
            const fileExtension = path.extname(file.originalname).toLowerCase();
            const fileName = `${fileID}${fileExtension}`;

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: `errorReports/${fileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: 'public-read',
            };

            await minioClient.putObject(params.Bucket, params.Key, params.Body, params.ContentType);

            mailOptions.attachments.push({
                filename: file.originalname,
                path: `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${process.env.BUCKET_NAME}/errorReports/${fileName}`
            });
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email: ", error);
                return res.status(500).json({ message: 'Internal server error while sending email' });
            }
            console.log("Email sent: ", info.response);
            res.status(200).json({ message: 'Email sent successfully', info: info });
        });

    } catch (error) {
        console.error('Error in sendErrorReport:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = sendErrorReport;