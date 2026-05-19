const express = require('express');
const router = express.Router()

const { register, login, refreshToken } = require('../controllers/authController');
const { verifyEmail } = require('../controllers/verifyEmail');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/v1/auth/register
 *  post
 *      summary: Register a new user (Customer or Vendor)
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: Object
 *                      required:
 *                          name
 *                          email
 *                          password
 *                      properties:
 *                          name:
 *                              type: string
 *                          email:
 *                              type: string
 *                          password:
 *                              type: string
 *                          role:
 *                              type: string
 *                              enum: [customer,vendor]
 *       responses:
 *              201:
 *                  description: User registration successful
 *              400:
 *                  description: Bad request
 *              500:
 *                  description: Server Error
 * 
 * 
 *          
 *          
 *  
 */

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token/:token', refreshToken);

router.get('/verify-email', verifyEmail);

router.get('/admin/dashboard', protect, restrictTo('admin'))


module.exports = router;


// router.post - deye korte hobe...