const router = require("express").Router();
const machineController = require('../controllers/machineController')

router.post('/add', machineController.addMachine)
router.post('/insertMachineData', machineController.insertMachineData)

module.exports = router;
