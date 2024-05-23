const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require('dotenv').config();
const sequelize = require('./config/database');
require('./config/associations');

const authRoutes = require('./routes/auth');
const tokenRoutes = require('./routes/token');
const otpRoutes = require('./routes/otp');
const userRoutes = require('./routes/user');
const machineRoutes = require('./routes/machine');

app.use(express.json());
app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/token', tokenRoutes);
app.use('/api/v2/otp', otpRoutes);
app.use('/api/v2/user', userRoutes);
app.use('/api/v2/machine', machineRoutes);

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