const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const {
  getAllDebits,
  createDebit,
  deleteDebit,
  payDebit,
} = require('../controllers/debit.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', getAllDebits);
router.post('/', createDebit);
router.delete('/:id', deleteDebit);
router.post('/pay', payDebit);

module.exports = router;
