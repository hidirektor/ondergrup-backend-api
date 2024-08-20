const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 } // 20MB
});

const getProfile = require('../controllers/user/getProfile');
const updateProfile = require('../controllers/user/updateProfile');
const getPreferences = require('../controllers/user/getPreferences');
const updatePreferences = require('../controllers/user/updatePreferences');
const uploadProfilePhoto = require('../controllers/user/uploadProfilePhoto');
const downloadProfilePhoto = require('../controllers/user/downloadProfilePhoto');
const getProfilePhoto = require('../controllers/user/getProfilePhoto');
const checkUser = require('../controllers/user/checkUser');

const authMiddleware = require('../middleware/authMiddleware');
const actionLogMiddleware = require('../middleware/actionLogMiddleware');

router.post('/getProfile', authMiddleware, getProfile);
router.post('/updateProfile', authMiddleware, actionLogMiddleware('UPDATE', 'Kullanıcı profili güncellendi.'), updateProfile);
router.post('/getPreferences', authMiddleware, getPreferences);
router.post('/updatePreferences', authMiddleware, actionLogMiddleware('UPDATE', 'Kullanıcı tercihleri güncellendi.'), updatePreferences);
router.post('/uploadProfilePhoto', authMiddleware, upload.single('file'), uploadProfilePhoto);
router.post('/downloadProfilePhoto', downloadProfilePhoto);
router.get('/getProfilePhoto/:userName', getProfilePhoto);
router.post('/checkUser', checkUser);

module.exports = router;