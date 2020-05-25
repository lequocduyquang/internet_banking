const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('@sgjobfit/common');
const { verifyEmployee } = require('../middleware/auth');
const {
  createCustomer,
  chargeCustomer,
  getTransactionLog,
} = require('../controllers/employee.controller');

const router = express.Router();

router.use(verifyEmployee);

router.post(
  '/create-customer',
  [
    body('username').isString(),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  createCustomer
);

router.post(
  '/charge',
  [body('account_number').isString(), body('amount').isNumeric()],
  validateRequest,
  chargeCustomer
);

router.get('/:account_number', getTransactionLog);

module.exports = router;
