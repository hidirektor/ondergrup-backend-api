const router = require("express").Router();
const authController = require("../controllers/authController");

router.post('/register', authController.createUser)
router.post('/login', authController.loginUser)
router.post('/directLogin', authController.directLoginUser)
router.post('/sendOTP', authController.sendOTP)
router.post('/getCipheredPass', authController.getPass)

module.exports = router;
