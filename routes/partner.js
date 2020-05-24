const express = require('express');
const { verifyPartner } = require('../middleware/auth');
const { getAccountProfile, sendMoney } = require('../controllers/partner.controller');

const router = express.Router();
router.use(verifyPartner);

router.get('/getProfile', getAccountProfile);
router.post('/sendMoney', sendMoney);

module.exports = router;
