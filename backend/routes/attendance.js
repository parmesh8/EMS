const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin', 'employee']), getAttendance);
router.post('/', authMiddleware(['employee']), markAttendance);
router.put('/:id', authMiddleware(['admin']), updateAttendance);
router.delete('/:id', authMiddleware(['admin']), deleteAttendance);

module.exports = router;