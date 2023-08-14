const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const profileInfoRouter = require('./requests/profileInfo');
const hidrolikInfoRouter = require('./requests/hidrolikInfo');
const login = require('./requests/login');
const register = require('./requests/register');
const insertHidrolik = require('./requests/insertHidrolik');
const orderNumbers = require('./requests/orderNumbers');
const insertMachineData = require('./requests/insertMachineData');
const uploadPhoto = require('./requests/uploadProfilePhoto'); // Eksik olan import satırı

dotenv.config();

const app = express();
const PORT = 3000;

// Multer ayarları
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

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
    const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}`;
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

// profileInfoRouter'ı kullanın
app.use('/api/profileInfo', profileInfoRouter);
app.use('/api/hidrolikInfo', hidrolikInfoRouter);

// login.js ve register.js dosyalarını dahil ediyoruz
app.post('/api/login', login);
app.post('/api/register', register);
app.post('/api/insertHidrolik', insertHidrolik);
app.post('/api/orderNumbers', orderNumbers);
app.post('/api/insertMachineData', insertMachineData);
app.post('/api/uploadProfilePhoto', upload.single('profilePhoto'), uploadPhoto);

// Log klasörünü oluştur ve log dosyasını oluştur
const logDirectory = path.join(__dirname, 'log');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
const logFilePath = path.join(logDirectory, 'log.txt');
fs.writeFileSync(logFilePath, ''); // Dosyayı sıfırla

app.listen(PORT, () => {
    console.log(`Sunucu çalışıyor, http://localhost:${PORT}`);
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