const express = require('express');
const { verifyPartner } = require('../middleware/auth');
const {
  getAccountProfile,
  getTokenByPartner,
  payin,
} = require('../controllers/partner.controller');

const router = express.Router();

router.post('/token', getTokenByPartner);
router.get('/getProfile', verifyPartner, getAccountProfile);
router.post('/payin', verifyPartner, payin);

module.exports = router;
