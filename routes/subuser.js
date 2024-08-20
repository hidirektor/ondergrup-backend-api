const express = require('express');
const router = express.Router();

const createSubUser = require('../controllers/subuser/createSubUser');
const deleteSubUser = require('../controllers/subuser/deleteSubUser');
const deActivateSubUser = require('../controllers/subuser/deActivateSubUser');
const activateSubUser = require('../controllers/subuser/activateSubUser');
const editSubUser = require('../controllers/subuser/editSubUser');
const getSubUsers = require('../controllers/subuser/getSubUsers');

const authMiddleware = require('../middleware/authMiddleware');
const actionLogMiddleware = require("../middleware/actionLogMiddleware");

router.post('/createSubUser', authMiddleware([]), actionLogMiddleware('CREATE', 'Alt kullanıcı oluşturuldu.'), createSubUser);
router.post('/deleteSubUser', authMiddleware([]), actionLogMiddleware('DELETE', 'Alt kullanıcı silindi.'), deleteSubUser);
router.post('/deActivateSubUser', authMiddleware([]), actionLogMiddleware('UPDATE', 'Alt kullanıcı deaktif edildi.'), deActivateSubUser);
router.post('/activateSubUser', authMiddleware([]), actionLogMiddleware('UPDATE', 'Alt kullanıcı aktif edildi.'), activateSubUser);
router.post('/editSubUser', authMiddleware([]), actionLogMiddleware('EDIT', 'Alt kullanıcı profili güncellendi.'), editSubUser);
router.post('/getSubUsers', authMiddleware([]), getSubUsers);

module.exports = router;