const express = require('express');
const { verifyPartner } = require('../middleware/auth');
const {
  getAccountProfile,
  getTokenByPartner,
  payin,
} = require('../controllers/partner.controller');

const router = express.Router();
router.use(verifyPartner);

router.post('/token', getTokenByPartner);
router.get('/getProfile', getAccountProfile);
router.post('/payin', payin);

module.exports = router;
