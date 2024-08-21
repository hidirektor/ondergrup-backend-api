const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
require('dotenv').config();
const sequelize = require('./config/database');
require('./config/associations');
const checkAndRefreshTokens = require('./helpers/tokenWorker');
const fs = require('fs');
const path = require('path');
const startQueueListener = require('./helpers/rabbitmq/queueListener');

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
const ticketRoutes = require('./routes/supportTicket');

const swaggerSpecs = require('./helpers/swaggerOptions');
fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpecs, null, 2));

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v2/auth', authRoutes);
app.use('/api/v2/authorized', authorizedRoutes);
app.use('/api/v2/hydraulic', hydraulicRoutes);
app.use('/api/v2/machine', machineRoutes);
app.use('/api/v2/otp', otpRoutes);
app.use('/api/v2/subUser', subUserRoutes);
app.use('/api/v2/token', tokenRoutes);
app.use('/api/v2/updateChecker', updateRoutes);
app.use('/api/v2/user', userRoutes);
app.use('/api/v2/ticket', ticketRoutes);
app.use('/api/v2', swaggerRoutes);

const server = http.createServer(app);
const io = new Server(server);

startQueueListener();

sequelize.sync({ force: false, alter: false }).then(async () => {
    server.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
}).catch((error) => {
    console.error('Unable to connect to the database:', error);
});