const router = require("express").Router();
const machineController = require('../controllers/machineController')

router.post('/add', machineController.addMachine)
router.post('/updateMachineData', machineController.updateMachineData)
router.post('/getMachines', machineController.getMachines)
router.get('/updateMachineDataRaw', machineController.updateMachineDataRaw)
router.get('/checkMachineID', machineController.checkMachineID)

module.exports = router;
