const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const getProfile = require('../controllers/user/getProfile');
const updateProfile = require('../controllers/user/updateProfile');
const getPreferences = require('../controllers/user/getPreferences');
const updatePreferences = require('../controllers/user/updatePreferences');
const uploadProfilePhoto = require('../controllers/user/uploadProfilePhoto');
const downloadProfilePhoto = require('../controllers/user/downloadProfilePhoto');
const getProfilePhoto = require('../controllers/user/getProfilePhoto');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/getProfile', authMiddleware, getProfile);
router.post('/updateProfile', authMiddleware, updateProfile);
router.post('/getPreferences', authMiddleware, getPreferences);
router.post('/updatePreferences', authMiddleware, updatePreferences);
router.post('/uploadProfilePhoto', upload.single('file'), uploadProfilePhoto);
router.post('/downloadProfilePhoto', downloadProfilePhoto);
router.get('/getProfilePhoto/:userName', getProfilePhoto);

//router.post('/uploadProfilePhoto', authMiddleware, uploadProfilePhoto);
//router.post('/downloadProfilePhoto', authMiddleware, downloadProfilePhoto);
//router.get('/getProfilePhoto', authMiddleware, getProfilePhoto);

module.exports = router;