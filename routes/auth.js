const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('@sgjobfit/common');
const {
  registerEmployee,
  registerAdmin,
  registerCustomer,
} = require('../controllers/auth.controller');

const router = express.Router();

router.post(
  '/employee/register/',
  [
    body('username').isString(),
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
    body('username').isString(),
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
    body('username').isString(),
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

module.exports = router;
