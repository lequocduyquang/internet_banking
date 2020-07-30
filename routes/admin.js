const express = require('express');
const { body } = require('express-validator');
const { validateRequest } = require('../utils/validate');
const {
  getAllEmployee,
  getEmployee,
  createEmployee,
  deleteEmployee,
  unblockEmployee,
  getAllTransaction,
} = require('../controllers/admin.controller');

const router = express.Router();
const { requireAuth, authorize } = require('../middleware/auth');

router.use(requireAuth);
router.use(authorize);

/** EMPLOYEE */
router.get('/employees', getAllEmployee);
router.get('/employees/:id', getEmployee);
router.post(
  '/employees',
  [
    body('username').isString(),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  createEmployee
);
router.delete('/employees/:id', deleteEmployee);
router.put('/employees/unblock/:id', unblockEmployee);
/** TRANSACTION  */
router.get('/transactions', getAllTransaction);

module.exports = router;
