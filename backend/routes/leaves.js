const express = require('express');
const router = express.Router();
const { getLeaves, createLeave, updateLeave, deleteLeave } = require('../controllers/leaveController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin', 'employee']), getLeaves);
router.post('/', authMiddleware(['employee']), createLeave);
router.put('/:id', authMiddleware(['admin']), updateLeave);
router.delete('/:id', authMiddleware(['admin']), deleteLeave);

module.exports = router;