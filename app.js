const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const https = require('https');
const path = require('path');
const fs = require('fs');
const cors = require("cors");
const bodyParser = require('body-parser');
const profileInfoRouter = require('./requests/profileInfo');
const hidrolikInfoRouter = require('./requests/hidrolikInfo');
const fileSystemRouter = require('./requests/fileSystem');
const fileViewRouter = require('./requests/fileView');
const login = require('./requests/login');
const register = require('./requests/register');
const insertHidrolik = require('./requests/insertHidrolik');
const orderNumbers = require('./requests/orderNumbers');
const insertMachineData = require('./requests/insertMachineData');
const getStatistics = require('./requests/getStatistics');
const getHydraulicInfo = require('./requests/getHydraulicInfo');
const updateProfile = require('./requests/update');
const wholeProfile = require('./requests/getWholeProfileInfo');
const update = require('./requests/update');
const sendOTP = require('./requests/sendOTP');
const updatePass = require('./requests/updatePass');

global.__basedir = __dirname;
dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json({ limit: '10mb' }));

function createConnection() {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    return mongoose.connection;
}

const connection = createConnection();
connection.on('error', (err) => {
    console.error('Veritabanına bağlanılamadı:', err);
});
connection.once('open', () => {
    console.log('Veritabanına başarıyla bağlanıldı.');
});

app.use(express.json());

// Middleware: İstekleri loglama
app.use((req, res, next) => {
    const logMessage = `<${req.method}> | <${req.headers['user-agent']}> | ${req.url} | <${new Date().toLocaleString()}>`;
    console.log(logMessage);
    fs.appendFile(path.join(__dirname, 'log', 'log.txt'), logMessage + '\n', (err) => {
        if (err) {
            console.error('Log dosyasına yazılırken bir hata oluştu:', err);
        }
    });
    next();
});

app.use((req, res, next) => {
    res.sendResponse = (status, data) => {
        const responseData = {
            success: status < 400,
            data,
        };
        res.status(status).json(responseData);
    };
    next();
});

app.use('/api/profileInfo', profileInfoRouter);
app.use('/api/hidrolikInfo', hidrolikInfoRouter);
app.use('/api/fileSystem', fileSystemRouter);
app.use('/api', fileViewRouter);

app.post('/api/login', login);
app.post('/api/register', register);
app.post('/api/insertHidrolik', insertHidrolik);
app.post('/api/orderNumbers', orderNumbers);
app.post('/api/insertMachineData', insertMachineData);
app.post('/api/getStatistics', getStatistics);
app.post('/api/getHydraulicInfo', getHydraulicInfo);
app.post('/api/updateProfile', updateProfile);
app.post('/api/getWholeProfile', wholeProfile);
app.post('/api/update', update);
app.post('/api/sendOTP', sendOTP);
app.post('/api/updatePass', updatePass);

const logDirectory = path.join(__dirname, 'log');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
const logFilePath = path.join(logDirectory, 'log.txt');
fs.writeFileSync(logFilePath, '');

const serverOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: process.env.CERT_PASS,
};

const server = https.createServer(serverOptions, app);

server.listen(PORT, () => {
    console.log(`Sunucu çalışıyor, https://localhost:${PORT}`);
});

process.on('SIGINT', () => {
    connection.close((err) => {
        if (err) {
            console.error('Veritabanı bağlantısı kapatılamadı:', err);
        } else {
            console.log('Veritabanı bağlantısı başarıyla kapatıldı.');
        }
        process.exit(0);
    });
});
