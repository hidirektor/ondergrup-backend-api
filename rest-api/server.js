const express = require('express')
const app = express()
const dotenv = require('dotenv');
const mysql = require('mysql2');
const fs = require("fs");
const path = require("path");
const https = require("https");

const errorHandler = require('./middleware/errorHandling');

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const fileRouter = require("./routes/file");
const hydraulicRouter = require("./routes/hydraulic");
const machineRouter = require("./routes/machine");

global.__basedir = __dirname;
dotenv.config();

const sslCertPath = path.join(__dirname, 'certificate.crt');
const sslKeyPath = path.join(__dirname, 'private.key');

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: "10mb", extended: true}));

const connection = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

const httpsOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath)
};

const httpsServer = https.createServer(httpsOptions, app);

connection.connect((err) => {
    if (err) {
        console.error('Veritabanına bağlanılamadı:', err);
    } else {
        console.log('Veritabanına başarıyla bağlanıldı.');
    }
});

const logDirectory = path.join(__dirname, 'log');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}
const logFilePath = path.join(logDirectory, 'log.txt');
fs.writeFileSync(logFilePath, '');

app.use(errorHandler);
app.use('/api', authRouter);
app.use('/api/users', userRouter);
app.use('/api/fileSystem', fileRouter);
app.use('/api/hydraulic', hydraulicRouter);
app.use('/api/machine', machineRouter);

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


app.listen(process.env.PORT || process.env.PORT, () => console.log(`Sunucu başlatıldı: http://localhost:${process.env.PORT }`))
//httpsServer.listen(process.env.PORT || process.env.HTTPS_PORT, () => {
    //console.log(`HTTPS sunucu başlatıldı: https://localhost:${process.env.PORT || process.env.HTTPS_PORT}`);
//});
