const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const {
  getAllDebits,
  createDebit,
  deleteDebit,
  payDebit,
  verifyOTP,
  verifyContact,
} = require('../controllers/debit.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', getAllDebits);
router.post('/', createDebit);
router.put('/:id', deleteDebit);
router.post('/pay', payDebit);

router.post('/verify/code', [body('OTP').notEmpty()], validateRequest, verifyOTP);

router.post(
  '/verify-contact',
  [body('account_number').isString().withMessage('Account number must be valid')],
  validateRequest,
  verifyContact
);

module.exports = router;
