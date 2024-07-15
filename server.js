const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require('dotenv').config();
const sequelize = require('./config/database');
require('./config/associations');

const fs = require('fs');
const path = require('path');

const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/token');
const otpRoutes = require('./routes/otp');
const userRoutes = require('./routes/user');
const machineRoutes = require('./routes/machine');
const authorizedRoutes = require('./routes/authorized');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Önder Grup Back End API',
            version: '2.0.0',
            description: 'Önder Grup Back End API for Embedded & Hydraulic',
            contact: {
                email: 'hidirektor@gmail.com',
                url: 'https://hidirektor.com.tr',
                name: 'Halil İbrahim Direktör'
            }
        },
        servers: [
            {
                url: 'http://85.95.231.92:3000',
                description: 'Local server'
            }
        ]
    },
    apis: ['./routes/*.js', './models/*.js', './controllers/**/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpecs, null, 2));

app.get('/api/developer/swagger.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'swagger.json'));
});

app.use('/api/developer/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
        url: '/swagger.json'
    }
}));

app.use(express.json());
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/token', tokenRoutes);
app.use('/api/v2/otp', otpRoutes);
app.use('/api/v2/user', userRoutes);
app.use('/api/v2/machine', machineRoutes);
app.use('/api/v2/authorized', authorizedRoutes);


const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('locationUpdate', (data) => {
        io.emit('locationUpdate', data);
    });
});

sequelize.sync({ force: true, alter: true }).then(() => {
    server.listen(process.env.PORT, () => {
        console.log('Server running on port 3000');
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});