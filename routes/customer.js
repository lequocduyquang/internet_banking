const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('@sgjobfit/common');
const { createContact, getAllContacts } = require('../controllers/customer.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.put(
  '/create-contact',
  [body('reminder_name').isString(), body('account_number').isString()],
  validateRequest,
  createContact
);

router.get('/list-contacts', getAllContacts);

module.exports = router;
