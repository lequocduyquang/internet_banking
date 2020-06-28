const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const {
  registerEmployee,
  registerAdmin,
  registerCustomer,
  loginEmployee,
  loginAdmin,
  loginCustomer,
  getEmployeeProfile,
  getAdminProfile,
  getCustomerProfile,
  updatePasswordCustomer,
  forgotPasswordCustomer,
  resetPasswordCustomer,
} = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/employee/register/',
  [
    body('username').isString().withMessage('Username must be valid'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  registerEmployee
);

router.post(
  '/admin/register',
  [
    body('username').isString().withMessage('Username must be valid'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  registerAdmin
);

router.post(
  '/customer/register',
  [
    body('username').isString().withMessage('Username must be valid'),
    body('fullname').isString().withMessage('Fullname must be valid'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('phone').isLength({ max: 15 }),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  registerCustomer
);

router.post(
  '/employee/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  loginEmployee
);

router.post(
  '/admin/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  loginAdmin
);

router.post(
  '/customer/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  loginCustomer
);

router.get('/employee/me', requireAuth, getEmployeeProfile);
router.get('/customer/me', requireAuth, getCustomerProfile);
router.get('/admin/me', requireAuth, getAdminProfile);

router.put(
  '/customer/update_password',
  [body('currentPassword').isString(), body('newPassword').isString()],
  requireAuth,
  updatePasswordCustomer
);

router.post(
  '/customer/forgot_password',
  [body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  forgotPasswordCustomer
);

router.put(
  '/customer/reset_password/:userID',
  [body('newPassword').isString()],
  validateRequest,
  resetPasswordCustomer
);

module.exports = router;
