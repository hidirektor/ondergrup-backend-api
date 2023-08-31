const router = require("express").Router();
const userController = require('../controllers/userController')

router.post('/profileInfo/:field', userController.profileInfo)
router.post('/getWholeProfileInfo', userController.getWholeProfileInfo)
router.post('/updateProfile', userController.updateProfile)
router.post('/updatePass', userController.updatePass)

module.exports = router;
