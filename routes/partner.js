const express = require('express');
const { verifyPartner } = require('../middleware/auth');
const { getAccountProfile } = require('../controllers/partner.controller');

const router = express.Router();
router.use(verifyPartner);

router.get('/getProfile', verifyPartner, getAccountProfile);

module.exports = router;
