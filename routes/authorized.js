const express = require('express');
const router = express.Router();

const getAllMachines = require('../controllers/authorized/machine/getAllMachines');
const getAllActions = require('../controllers/authorized/actionlog/getAllActions');
const getAllMaintenances = require('../controllers/authorized/maintenance/getAllMaintenances');
const getAllVersions = require('../controllers/authorized/machine/getAllVersions');
const updateOwner = require('../controllers/authorized/machine/updateOwner');

const getAllUsers = require('../controllers/authorized/user/getAllUsers');
const deActivateUser = require('../controllers/authorized/user/deActivateUser');
const activateUser = require('../controllers/authorized/user/activateUser');
const deleteUser = require('../controllers/authorized/user/deleteUser');
const addUser = require('../controllers/authorized/user/addUser');
const updateRole = require('../controllers/authorized/user/updateRole');
const updateUser = require('../controllers/authorized/user/updateUser');

const createMaintenance = require('../controllers/authorized/maintenance/createMaintenance');
const editMaintenance = require('../controllers/authorized/maintenance/editMaintenance');
const deleteMaintenance = require('../controllers/authorized/maintenance/deleteMaintenance');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/getAllActions', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), getAllActions);
router.get('/getAllMachines', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), getAllMachines);
router.get('/getAllMaintenances', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), getAllMaintenances);
router.get('/getAllVersions', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), getAllVersions);

router.put('/updateOwner', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), updateOwner);

router.get('/getAllUsers', authMiddleware, roleMiddleware(['SYSOP']), getAllUsers);
router.post('/deActivateUser', authMiddleware, roleMiddleware(['SYSOP']), deActivateUser);
router.post('/activateUser', authMiddleware, roleMiddleware(['SYSOP']), activateUser);
router.post('/deleteUser', authMiddleware, roleMiddleware(['SYSOP']), deleteUser);
router.post('/addUser', authMiddleware, roleMiddleware(['SYSOP']), addUser);
router.put('/updateRole', authMiddleware, roleMiddleware(['SYSOP']), updateRole);
router.post('/updateUser', authMiddleware, roleMiddleware(['SYSOP']), updateUser);

router.post('/createMaintenance', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), createMaintenance);
router.put('/editMaintenance', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), editMaintenance);
router.delete('/deleteMaintenance', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), deleteMaintenance);

module.exports = router;