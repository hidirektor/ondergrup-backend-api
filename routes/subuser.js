const express = require('express');
const router = express.Router();

const createSubUser = require('../controllers/subuser/createSubUser');
const deleteSubUser = require('../controllers/subuser/deleteSubUser');
const deActivateSubUser = require('../controllers/subuser/deActivateSubUser');
const editSubUser = require('../controllers/subuser/editSubUser');
const getSubUsers = require('../controllers/subuser/getSubUsers');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/createSubUser', authMiddleware, createSubUser);
router.post('/deleteSubUser', authMiddleware, deleteSubUser);
router.post('/deActivateSubUser', authMiddleware, deActivateSubUser);
router.post('/editSubUser', authMiddleware, editSubUser);
router.post('/getSubUsers', authMiddleware, getSubUsers);

module.exports = router;