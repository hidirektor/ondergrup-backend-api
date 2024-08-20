const express = require('express');
const router = express.Router();

const create = require('../controllers/machine/createMachine');
const add = require('../controllers/machine/addMachine');
const getMachines = require('../controllers/machine/getMachines');
const updateMachine = require('../controllers/machine/updateMachine');
const updateMachineRaw = require('../controllers/machine/updateMachineRaw');
const checkMachine = require('../controllers/machine/checkMachine');
const checkMachineRaw = require('../controllers/machine/checkMachineRaw');

const getErrors = require('../controllers/machine/getErrors');
const getErrorsAll = require('../controllers/machine/getErrorsAll');
const getMaintenances = require('../controllers/machine/getMaintenances');
const getMaintenancesAll = require('../controllers/machine/getMaintenancesAll');

const authMiddleware = require('../middleware/authMiddleware');
const actionLogMiddleware = require("../middleware/actionLogMiddleware");

router.post('/createMachine', authMiddleware([]), actionLogMiddleware('ADD', 'Sisteme yeni makine eklendi.'), create);
router.post('/addMachine', authMiddleware([]), actionLogMiddleware('SYNCH', 'Makine kullanıcı ile eşleştirildi.'), add);
router.post('/getMachines', authMiddleware([]), getMachines);
router.post('/updateMachine', updateMachine);
router.get('/updateMachineRaw', updateMachineRaw);
router.get('/checkMachineID', checkMachine);
router.get('/checkMachineIDRaw', checkMachineRaw);
router.post('/getErrors', authMiddleware([]), getErrors);
router.post('/getErrorsAll', authMiddleware([]), getErrorsAll);
router.post('/getMaintenances', authMiddleware([]), getMaintenances);
router.post('/getMaintenancesAll', authMiddleware([]), getMaintenancesAll);

module.exports = router;