const router = require("express").Router();
const machineController = require('../controllers/machineController')

router.post('/add', machineController.addMachine)
router.post('/insertMachineData', machineController.insertMachineData)
router.post('/updateMachineData', machineController.updateMachineData)
router.post('/getMachines', machineController.getMachines)

module.exports = router;
