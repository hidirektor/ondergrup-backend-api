const express = require('express');
const router = express.Router();

const createTicket = require('../controllers/supportTicket/createTicket');
const deleteTicket = require('../controllers/supportTicket/deleteTicket');
const responseTicket = require('../controllers/supportTicket/responseTicket');
const getTickets = require('../controllers/supportTicket/getTickets');
const getAllTickets = require('../controllers/supportTicket/getAllTickets');
const closeTicket = require('../controllers/supportTicket/closeTicket');

const authMiddleware = require('../middleware/authMiddleware');
const actionLogMiddleware = require('../middleware/actionLogMiddleware');

router.post('/createTicket', authMiddleware(['NORMAL']), actionLogMiddleware('CREATE', 'Destek talebi oluşturuldu.'), createTicket);
router.delete('/deleteTicket', authMiddleware(['ENGINEER', 'SYSOP']), actionLogMiddleware('DELETE', 'Destek talebi silindi.'), deleteTicket);
router.post('/responseTicket', authMiddleware(['TECHNICIAN', 'ENGINEER', 'SYSOP']), actionLogMiddleware('UPDATE', 'Destek talebine cevap verildi.'), responseTicket);
router.post('/getTickets', authMiddleware(['NORMAL']), getTickets);
router.get('/getAllTickets', authMiddleware(['ENGINEER', 'SYSOP']), getAllTickets);
router.post('/closeTicket', authMiddleware(['ENGINEER', 'SYSOP']), actionLogMiddleware('CLOSE', 'Destek talebi kapatıldı.'), closeTicket);

module.exports = router;