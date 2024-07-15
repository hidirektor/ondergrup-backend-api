const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Önder Grup Back End API',
        version: '2.0.0',
        description: 'Önder Grup Back End API for Embedded & Hydraulic',
        contact: {
            name: 'Halil İbrahim Direktör',
            email: 'hidirektor@gmail.com',
            url: 'https://hidirektor.com.tr',
        },
    },
    servers: [
        {
            url: 'http://85.95.231.92:3000',
            description: 'Local server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js', './models/*.js', './controllers/**/*.js'],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = swaggerSpecs;