const express = require('express');
const router = express.Router();
const { getDepartments, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware(['admin']), getDepartments);
router.post('/', authMiddleware(['admin']), createDepartment);
router.put('/:id', authMiddleware(['admin']), updateDepartment);
router.delete('/:id', authMiddleware(['admin']), deleteDepartment);

module.exports = router;