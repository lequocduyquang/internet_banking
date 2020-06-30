const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const { getAllDebit, createDebit, deleteDebit } = require('../controllers/debit.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', getAllDebit);
router.post('/', createDebit);
router.delete('/:id', deleteDebit);

module.exports = router;
