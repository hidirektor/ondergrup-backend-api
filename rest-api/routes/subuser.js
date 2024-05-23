const express = require('express');
const router = express.Router();

const createSubUser = require('../controllers/subuser/createSubUser');
const deleteSubUser = require('../controllers/subuser/deleteSubUser');
const editSubUser = require('../controllers/subuser/editSubUser');
const getSubUsers = require('../controllers/subuser/getSubUsers');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/createSubUser', authMiddleware, roleMiddleware(['NORMAL']), createSubUser);
router.delete('/deleteSubUser', authMiddleware, roleMiddleware(['NORMAL']), deleteSubUser);
router.put('/editSubUser', authMiddleware, roleMiddleware(['NORMAL']), editSubUser);
router.get('/getSubUsers', authMiddleware, roleMiddleware(['NORMAL']), getSubUsers);

module.exports = router;