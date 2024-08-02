const express = require('express');
const router = express.Router();

const create = require('../controllers/machine/createMachine');
const add = require('../controllers/machine/addMachine');
const getMachines = require('../controllers/machine/getMachines');
const updateMachine = require('../controllers/machine/updateMachine');
const updateMachineRaw = require('../controllers/machine/updateMachineRaw');
const checkMachine = require('../controllers/machine/checkMachine');

const getErrors = require('../controllers/machine/getErrors');
const getErrorsAll = require('../controllers/machine/getErrorsAll');
const getMaintenances = require('../controllers/machine/getMaintenances');
const getMaintenancesAll = require('../controllers/machine/getMaintenancesAll');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/createMachine', authMiddleware, create);
router.post('/addMachine', authMiddleware, add);
router.get('/getMachines', authMiddleware, getMachines);
router.post('/updateMachine', updateMachine);
router.get('/updateMachineRaw', updateMachineRaw);
router.get('/checkMachineID', checkMachine);
router.get('/getErrors', authMiddleware, getErrors);
router.get('/getErrorsAll', authMiddleware, getErrorsAll);
router.get('/getMaintenances', authMiddleware, getMaintenances);
router.get('/getMaintenancesAll', authMiddleware, getMaintenancesAll);

module.exports = router;