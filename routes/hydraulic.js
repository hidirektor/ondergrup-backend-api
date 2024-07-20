const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const createHydraulicUnit = require('../controllers/hydraulic/createHydraulicUnit');
const downloadPartList = require('../controllers/hydraulic/downloadPartList');
const downloadSchematic = require('../controllers/hydraulic/downloadSchematic');
const getPartList = require('../controllers/hydraulic/getPartList');
const getSchematic = require('../controllers/hydraulic/getSchematic');
const getOrderNumber = require('../controllers/hydraulic/getHydraulicUnitNumber');
const getHydraulicStats = require('../controllers/hydraulic/getHydraulicStats');
const getHydraulicDetails = require('../controllers/hydraulic/getHydraulicDetails');

const authMiddleware = require('../middleware/authMiddleware');

router.post('/createHydraulicUnit', upload.fields([
    { name: 'partListFile', maxCount: 1 },
    { name: 'schematicFile', maxCount: 1 }
]), createHydraulicUnit);
router.post('/downloadPartList', downloadPartList);
router.post('/downloadSchematic', downloadSchematic);
router.get('/getPartList/:orderID', getPartList);
router.get('/getSchematic/:orderID', getSchematic);
router.get('/getOrderNumber', getOrderNumber);
router.get('/getHydraulicStats', getHydraulicStats);
router.get('/getHydraulicDetails', getHydraulicDetails);

module.exports = router;