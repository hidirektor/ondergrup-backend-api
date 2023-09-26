const router = require("express").Router();
const fileController = require("../controllers/fileController");

router.post('/upload', fileController.upload)
router.post('/uploadPDF', fileController.uploadPDF)
router.post('/uploadExcel', fileController.uploadExcel)
router.get('/listFiles', fileController.getListFiles)
router.post('/download', fileController.download)
router.post('/downloadPhoto', fileController.downloadPhoto)
router.delete('/remove/:name', fileController.remove)
router.delete('/removeSync/:name', fileController.removeSync)
router.get('/view/:fileName', fileController.view)
router.get('/viewer/:fileName', fileController.viewer)
router.get('/tv/:fileName', fileController.readFile)
router.get('/getPhoto/:username', fileController.getPhoto)

module.exports = router;
