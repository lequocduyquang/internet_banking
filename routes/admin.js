const express = require('express');
const {
  getAllEmployee,
  getEmployee,
  createEmployee,
  deleteEmployee,
} = require('../controllers/admin.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/employees', getAllEmployee);
// router.get('/employees/:id', getEmployee);
// router.post('/employees', createEmployee);
router.delete('/employees/:employeeId', deleteEmployee);

module.exports = router;
