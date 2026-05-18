const express = require('express');
const router = express.Router()

const { register, login, refreshToken } = require('../controllers/authController');
const { verifyEmail } = require('../controllers/verifyEmail');

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token/:token', refreshToken);

router.get('/verify-email', verifyEmail);


module.exports = router;


// router.post - deye korte hobe...