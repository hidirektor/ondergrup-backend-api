const express = require('express');
const router = express.Router();

const getAllMachines = require('../controllers/authorized/machine/getAllMachines');
const updateOwner = require('../controllers/authorized/machine/updateOwner');

const getAllUsers = require('../controllers/authorized/user/getAllUsers');
const deleteUser = require('../controllers/authorized/user/deleteUser');
const updateRole = require('../controllers/authorized/user/updateRole');

const createMaintenance = require('../controllers/authorized/maintenance/createMaintenance');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/getAllMachines', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), getAllMachines);
router.post('/updateOwner', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), updateOwner);
router.get('/getAllUsers', authMiddleware, roleMiddleware(['SYSOP']), getAllUsers);
router.delete('/deleteUser', authMiddleware, roleMiddleware(['SYSOP']), deleteUser);
router.post('/updateRole', authMiddleware, roleMiddleware(['SYSOP']), updateRole);
router.post('/createMaintenance', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), createMaintenance);

module.exports = router;