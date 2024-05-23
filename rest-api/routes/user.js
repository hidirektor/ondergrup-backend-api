const express = require('express');
const router = express.Router();
const getProfile = require('../controllers/user/getProfile');
const updateProfile = require('../controllers/user/updateProfile');
const getPreferences = require('../controllers/user/getPreferences');
const updatePreferences = require('../controllers/user/updatePreferences');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/getProfile', authMiddleware, getProfile);
router.post('/updateProfile', authMiddleware, updateProfile);
router.post('/getPreferences', authMiddleware, getPreferences);
router.post('/updatePreferences', authMiddleware, updatePreferences);

module.exports = router;