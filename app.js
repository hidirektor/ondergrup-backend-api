const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

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

const UserModel = require('./models/UserSchema');

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

// login.js ve register.js dosyalarını dahil ediyoruz
const login = require('./requests/login');
const register = require('./requests/register');

app.post('/api/login', login); // login.js'deki login fonksiyonu burada kullanılacak
app.post('/api/register', register); // register.js'deki register fonksiyonu burada kullanılacak

const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu çalışıyor, https://localhost:${port}`);
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
