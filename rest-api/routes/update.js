const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const checkUpdates = require('../controllers/update/checkUpdates');
const createVersion = require('../controllers/update/createVersion');
const downloadNewVersion = require('../controllers/update/downloadNewVersion');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/checkUpdates', authMiddleware, checkUpdates);
router.post('/createVersion', authMiddleware, roleMiddleware(['Admin']), upload.single('file'), createVersion);
router.post('/downloadNewVersion', authMiddleware, downloadNewVersion);

module.exports = router;