const express = require('express');
const { validateRequest } = require('@sgjobfit/common');
const { body } = require('express-validator');

const router = express.Router();

const {
  transactionPartner,
  transactionInternal,
} = require('../controllers/transaction.controller');

router.post(
  '/transaction',
  [body('message').isString(), body('privateKey').isString()],
  validateRequest,
  transactionPartner
);
router.post(
  '/internal/transaction',
  [
    body('sender_account_number').isString(),
    body('receiver_account_number').isString(),
    body('transaction_type').isInt(),
    body('partner_code').isString(),
  ],
  validateRequest,
  transactionInternal
);

module.exports = router;
