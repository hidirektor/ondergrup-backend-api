const express = require('express');
const router = express.Router();

const add = require('../controllers/machine/add');
const getMachines = require('../controllers/machine/getMachines');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/addMachine', authMiddleware, add);
router.post('/getMachines', authMiddleware, getMachines);

module.exports = router;