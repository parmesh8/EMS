const express = require('express');
const router = express.Router();
const { getEmployees, createEmployee, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin']), getEmployees);
router.post('/', authMiddleware(['admin']), createEmployee);
router.put('/:id', authMiddleware(['admin']), updateEmployee);
router.delete('/:id', authMiddleware(['admin']), deleteEmployee);

module.exports = router;