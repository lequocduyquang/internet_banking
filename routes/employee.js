const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const { verifyEmployee } = require('../middleware/auth');
const {
  createCustomer,
  payInCustomer,
  getTransactionLog,
} = require('../controllers/employee.controller');

const router = express.Router();

router.use(verifyEmployee);

router.post(
  '/create-customer',
  [
    body('username').isString().withMessage('Name must be valid'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('fullname').isString().withMessage('Fullname must be valid'),
    body('phone').isString().withMessage('Phone must be valid'),
    body('address').isString().withMessage('Address must be valid'),
  ],
  validateRequest,
  createCustomer
);

router.post(
  '/payin',
  [body('account_number').isString(), body('amount').isNumeric()],
  validateRequest,
  payInCustomer
);

router.get('/history/:account_number', getTransactionLog);

module.exports = router;
