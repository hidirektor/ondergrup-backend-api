const express = require('express');
const router = express.Router();

const add = require('../controllers/machine/addMachine');
const getMachines = require('../controllers/machine/getMachines');
const updateMachine = require('../controllers/machine/updateMachine');
const updateMachineRaw = require('../controllers/machine/updateMachineRaw');
const checkMachine = require('../controllers/machine/checkMachine');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/addMachine', authMiddleware, add);
router.post('/getMachines', authMiddleware, getMachines);
router.put('/updateMachine', authMiddleware, updateMachine);
router.put('/updateMachineRaw', updateMachineRaw);
router.post('/checkMachineID', authMiddleware, checkMachine);

module.exports = router;