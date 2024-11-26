const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({
    limits: { files: 7 }, // Maksimum 7 dosya yüklenebilir
    fileFilter: (req, file, cb) => {
        // Dosya türü kontrolü yapılabilir
        cb(null, true); // Burada dosya türü filtrelemek isterseniz logic ekleyebilirsiniz
    }
}).array('files'); // 'files' alanı üzerinden birden fazla dosya almayı sağlar

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

const sendToAll = require('../controllers/authorized/notification/sendToAll');

const sendAlertMail = require('../controllers/authorized/admin/sendAlertMail');
const sendErrorReport = require('../controllers/authorized/admin/sendBugReport');

const createMaintenance = require('../controllers/authorized/maintenance/createMaintenance');
const editMaintenance = require('../controllers/authorized/maintenance/editMaintenance');
const deleteMaintenance = require('../controllers/authorized/maintenance/deleteMaintenance');

const authMiddleware = require('../middleware/authMiddleware');
const actionLogMiddleware = require("../middleware/actionLogMiddleware");

router.get('/getAllActions', authMiddleware(['SYSOP', 'ENGINEER']), getAllActions);
router.get('/getAllMachines', authMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), getAllMachines);
router.get('/getAllMaintenances', authMiddleware(['SYSOP', 'ENGINEER']), getAllMaintenances);
router.get('/getAllVersions', authMiddleware(['SYSOP', 'ENGINEER']), getAllVersions);
router.get('/getAllSubUsers', authMiddleware(['SYSOP', 'ENGINEER']), getAllSubUsers);

router.put('/updateOwner', authMiddleware(['SYSOP', 'ENGINEER']), actionLogMiddleware('UPDATE', 'Makine sahibi değiştirildi.'), updateOwner);
router.post('/sendAlertMail', authMiddleware(['SYSOP', 'ENGINEER']), sendAlertMail);
router.post('/sendErrorReport', upload, sendErrorReport);

router.post('/sendToAll', authMiddleware(['SYSOP', 'ENGINEER']), sendToAll);

router.get('/getAllUsers', authMiddleware(['SYSOP']), getAllUsers);
router.post('/deActivateUser', authMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı deaktif edildi.'), deActivateUser);
router.post('/activateUser', authMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı aktif edildi.'), activateUser);
router.post('/deleteUser', authMiddleware(['SYSOP']), actionLogMiddleware('DELETE', 'Kullanıcı silindi.'), deleteUser);
router.post('/addUser', authMiddleware(['SYSOP']), actionLogMiddleware('ADD', 'Kullanıcı oluşturuldu.'), addUser);
router.put('/updateRole', authMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı rolü güncellendi.'), updateRole);
router.post('/updateUser', authMiddleware(['SYSOP']), actionLogMiddleware('UPDATE', 'Kullanıcı profili güncellendi.'),  updateUser);

router.post('/createMaintenance', authMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), createMaintenance);
router.put('/editMaintenance', authMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), actionLogMiddleware('EDIT', 'Bakım kaydı güncellendi.'), editMaintenance);
router.delete('/deleteMaintenance', authMiddleware(['SYSOP', 'ENGINEER', 'TECHNICIAN']), actionLogMiddleware('DELETE', 'Bakım kaydı silindi.'), deleteMaintenance);

module.exports = router;