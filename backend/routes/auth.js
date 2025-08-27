const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/register', authMiddleware(['admin']), register);

module.exports = router;