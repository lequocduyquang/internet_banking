const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const { verifyEmployee } = require('../middleware/auth');
const {
  createCustomer,
  payInCustomer,
  verifyCustomer,
  getTransactionLog,
  getTransactionLogV2,
} = require('../controllers/employee.controller');

const router = express.Router();

// router.use(verifyEmployee);

router.post(
  '/create-customer',
  [
    body('username').isString().withMessage('Name must be valid').notEmpty(),
    body('email').isEmail().withMessage('Email must be valid').notEmpty(),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
      .notEmpty(),
    body('fullname').isString().withMessage('Fullname must be valid').notEmpty(),
    body('phone').isString().withMessage('Phone must be valid').notEmpty(),
    body('address').isString().withMessage('Address must be valid').notEmpty(),
  ],
  validateRequest,
  createCustomer
);

router.post(
  '/verify-customer',
  [body('account_number').isString().withMessage('Account number must be valid')],
  validateRequest,
  verifyCustomer
);
router.post(
  '/payin',
  [body('account_number').isString(), body('amount').isDecimal()],
  validateRequest,
  payInCustomer
);

router.get('/history/:account_number', getTransactionLog);
router.get('/history/test/:account_number', getTransactionLogV2);

module.exports = router;
