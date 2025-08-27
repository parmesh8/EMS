const express = require('express');
const router = express.Router();
const { getSalaries, createSalary, updateSalary, deleteSalary } = require('../controllers/salaryController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin', 'employee']), getSalaries);
router.post('/', authMiddleware(['admin']), createSalary);
router.put('/:id', authMiddleware(['admin']), updateSalary);
router.delete('/:id', authMiddleware(['admin']), deleteSalary);

module.exports = router;