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
const authorizedRoutes = require('./routes/authorized');
const hydraulicRoutes = require('./routes/hydraulic');
const machineRoutes = require('./routes/machine');
const otpRoutes = require('./routes/otp');
const subUserRoutes = require('./routes/subuser');
const tokenRoutes = require('./routes/token');
const updateRoutes = require('./routes/update');
const userRoutes = require('./routes/user');
const swaggerRoutes = require('./routes/swagger');

const swaggerSpecs = require('./helpers/swaggerOptions');
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpecs, null, 2));

app.use(express.json());
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/authorized', authorizedRoutes);
app.use('/api/v2/hydraulic', hydraulicRoutes);
app.use('/api/v2/machine', machineRoutes);
app.use('/api/v2/otp', otpRoutes);
app.use('/api/v2/subUser', subUserRoutes);
app.use('/api/v2/token', tokenRoutes);
app.use('/api/v2/updateChecker', updateRoutes);
app.use('/api/v2/user', userRoutes);
app.use('/api/v2', swaggerRoutes);


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