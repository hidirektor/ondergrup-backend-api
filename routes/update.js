const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});

const checkUpdates = require('../controllers/update/checkUpdates');
const checkUpdatesRaw = require('../controllers/update/checkUpdatesRaw');
const createVersion = require('../controllers/update/createVersion');
const downloadNewVersion = require('../controllers/update/downloadNewVersion');
const downloadNewVersionRaw = require('../controllers/update/downloadNewVersionRaw');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const actionLogMiddleware = require("../middleware/actionLogMiddleware");

router.post('/checkUpdates', checkUpdates);
router.get('/checkUpdatesRaw', checkUpdatesRaw);
router.post('/createVersion', upload.single('file'), authMiddleware, actionLogMiddleware('CREATE', 'Yeni STM32 sürümü oluşturuldu.'), createVersion);
router.post('/downloadNewVersion', downloadNewVersion);
router.get('/downloadNewVersionRaw', downloadNewVersionRaw);

module.exports = router;