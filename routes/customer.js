const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const {
  getMyAccount,
  createContact,
  getAllContacts,
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

module.exports = router;
