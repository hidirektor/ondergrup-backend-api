const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerController = require('../controllers/docs/swagger');

router.get('/swagger.json', swaggerController.getSwaggerJson);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
    swaggerOptions: {
        url: '/api/v2/swagger.json'
    }
}));

module.exports = router;