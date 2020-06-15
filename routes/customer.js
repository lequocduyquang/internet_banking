const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const {
  getMyAccount,
  createContact,
  getAllContacts,
  deleteContact,
  getHistory,
} = require('../controllers/customer.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/my-account', getMyAccount);
router.put(
  '/create-contact',
  [body('reminder_name').isString(), body('account_number').isString()],
  validateRequest,
  createContact
);

router.get('/list-contacts', getAllContacts);
router.delete('/list-contacts/:account_number', deleteContact);
router.get('/history', getHistory);

module.exports = router;
