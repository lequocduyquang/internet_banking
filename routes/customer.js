const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const {
  getMyAccount,
  createContact,
  getAllContacts,
  updateContact,
  deleteContact,
  getHistory,
  verifyContact,
} = require('../controllers/customer.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/my-account', getMyAccount);

router.post(
  '/verify-contact',
  [body('account_number').isString().withMessage('Account number must be valid')],
  validateRequest,
  verifyContact
);
router.post('/create-contact', [body('account_number').isString()], validateRequest, createContact);
router.get('/list-contacts', getAllContacts);
router.put('/list-contacts/:account_number', updateContact);
router.delete('/list-contacts/:account_number', deleteContact);

router.get('/history/:account_number', getHistory);

module.exports = router;
