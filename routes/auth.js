const express = require('express');
const router = express.Router();
const register = require('../controllers/auth/register');
const login = require('../controllers/auth/login');
const logout = require('../controllers/auth/logout');
const changePass = require('../controllers/auth/changePass');
const resetPass = require('../controllers/auth/resetPass');

const authMiddleware = require('../middleware/authMiddleware');
const actionLogMiddleware = require('../middleware/actionLogMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/changePass', authMiddleware, actionLogMiddleware('UPDATE', 'Şifre değiştirildi.'), changePass);
router.post('/resetPass', resetPass);

module.exports = router;