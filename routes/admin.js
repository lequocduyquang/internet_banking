const express = require('express');
const { getAllEmployee, deleteEmployee } = require('../controllers/admin.controller');

const router = express.Router();
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/employees', getAllEmployee);
router.delete('/employees/:employeeId', deleteEmployee);

module.exports = router;
