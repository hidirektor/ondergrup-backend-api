const router = require("express").Router();
const hydraulicController = require('../controllers/hydraulicController')

router.post('/orderNumbers', hydraulicController.orderNumbers)
router.post('/insertHidrolik', hydraulicController.insertHidrolik)
router.post('/hidrolikInfo/:field', hydraulicController.hidrolikInfo)
router.post('/getStatistics', hydraulicController.getStatistics)
router.post('/getHydraulicInfo', hydraulicController.getHydraulicInfo)
router.post('/getCustomHydraulicInfo', hydraulicController.getCustomHydraulicInfo)

module.exports = router;
