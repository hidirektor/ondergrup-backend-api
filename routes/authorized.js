const express = require('express');
const router = express.Router();

const getAllMachines = require('../controllers/authorized/machine/getAllMachines');
const getAllActions = require('../controllers/authorized/actionlog/getAllActions');
const getAllMaintenances = require('../controllers/authorized/maintenance/getAllMaintenances');
const getAllVersions = require('../controllers/authorized/machine/getAllVersions');
const getAllSubUsers = require('../controllers/authorized/user/getAllSubUsers');
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
const actionLogMiddleware = require("../middleware/actionLogMiddleware");

router.get('/getAllActions', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), getAllActions);
router.get('/getAllMachines', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), getAllMachines);
router.get('/getAllMaintenances', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), getAllMaintenances);
router.get('/getAllVersions', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), getAllVersions);
router.get('/getAllSubUsers', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), getAllSubUsers);

router.put('/updateOwner', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER']), actionLogMiddleware('UPDATE', 'Makine sahibi değiştirildi.'), updateOwner);

router.get('/getAllUsers', authMiddleware, roleMiddleware(['SYSOP']), getAllUsers);
router.post('/deActivateUser', authMiddleware, roleMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı deaktif edildi.'), deActivateUser);
router.post('/activateUser', authMiddleware, roleMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı aktif edildi.'), activateUser);
router.post('/deleteUser', authMiddleware, roleMiddleware(['SYSOP']), actionLogMiddleware('DELETE', 'Kullanıcı silindi.'), deleteUser);
router.post('/addUser', authMiddleware, roleMiddleware(['SYSOP']), actionLogMiddleware('ADD', 'Kullanıcı oluşturuldu.'), addUser);
router.put('/updateRole', authMiddleware, roleMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı rolü güncellendi.'), updateRole);
router.post('/updateUser', authMiddleware, roleMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı profili güncellendi.'),  updateUser);

router.post('/createMaintenance', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), createMaintenance);
router.put('/editMaintenance', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), actionLogMiddleware('EDIT', 'Bakım kaydı güncellendi.'), editMaintenance);
router.delete('/deleteMaintenance', authMiddleware, roleMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), actionLogMiddleware('DELETE', 'Bakım kaydı silindi.'), deleteMaintenance);

module.exports = router;