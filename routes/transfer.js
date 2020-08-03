const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');

const router = express.Router();

const {
  verifyInternalAccount,
  verifyPartnerAccount,
  transactionPartner,
  transferInternal,
  verifyOTP,
} = require('../controllers/transfer.controller');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Transfer INTERNAL
router.post(
  '/internal/verify',
  [body('receiver_account_number').isString()],
  validateRequest,
  verifyInternalAccount
);
router.post(
  '/internal',
  [
    body('sender_account_number').isString(),
    body('receiver_account_number').isString(),
    body('message').isString(),
    body('transfer_method').isInt(),
  ],
  validateRequest,
  transferInternal
);
router.post(
  '/customer/verify/code',
  [body('OTP').notEmpty(), body('email').isEmail().withMessage('Email must be valid')],
  validateRequest,
  verifyOTP
);

// Transfer PARTNER
router.post(
  '/partner/verify',
  [body('receiver_account_number').isString()],
  validateRequest,
  verifyPartnerAccount
);

router.post(
  '/partner',
  [body('message').isString(), body('privateKey').isString()],
  validateRequest,
  transactionPartner
);

module.exports = router;
