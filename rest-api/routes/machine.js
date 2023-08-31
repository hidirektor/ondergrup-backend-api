const router = require("express").Router();
const machineController = require('../controllers/machineController')

router.post('/insertMachineData', machineController.insertMachineData)

module.exports = router;
