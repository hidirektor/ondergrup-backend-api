const path = require('path');

exports.getSwaggerJson = (req, res) => {
    res.sendFile(path.join(__dirname, '../../swagger.json'));
};