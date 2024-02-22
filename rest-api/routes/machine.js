const router = require("express").Router();
const machineController = require('../controllers/machineController')

router.post('/add', machineController.addMachine)
router.post('/updateMachineData', machineController.updateMachineData)
router.post('/getMachines', machineController.getMachines)
router.get('/updateMachineDataRaw', machineController.updateMachineDataRaw)
router.get('/checkMachineID', machineController.checkMachineID)
router.post('/getMachineErrors', machineController.getMachineErrors)
router.post('/getMachineErrorsAll', machineController.getMachineErrorsAll)
router.post('/getMachineMaintenances', machineController.getMachineMaintenances)
router.post('/getMachineMaintenancesAll', machineController.getMachineMaintenancesAll)
router.post('/getAllMachines', machineController.getAllMachines)

module.exports = router;
