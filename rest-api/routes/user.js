const router = require("express").Router();
const userController = require('../controllers/userController')

router.post('/profileInfo/:field', userController.profileInfo)
router.post('/getWholeProfileInfo', userController.getWholeProfileInfo)
router.post('/updateProfile', userController.updateProfile)
router.post('/updatePass', userController.updatePass)
router.post('/getAllUsers', userController.getAllUsers)
router.post('/deleteUser', userController.deleteUser)
router.post('updateRole', userController.updateRole)

module.exports = router;
