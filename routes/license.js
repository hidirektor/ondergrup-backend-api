const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const createLicense = require('../controllers/license/createLicense');
const deleteLicense = require('../controllers/license/deleteLicense');
const checkLicense = require('../controllers/license/checkLicense');
const activateLicense = require('../controllers/license/activateLicense');

router.post('/create', authMiddleware(['SYSOP', 'ENGINEER']), createLicense);
router.post('/delete', authMiddleware(['SYSOP', 'ENGINEER']), deleteLicense);
router.post('/check', checkLicense);
router.post('/activate', authMiddleware([]), activateLicense);

module.exports = router;