const { BadRequestError } = require('@sgjobfit/common');
const { decrypt } = require('../utils/pgp');
const models = require('../models/customer.model');

const getAccountProfile = async (req, res, next) => {
  try {
    const { message } = req.headers;
    if (!message) {
      throw new BadRequestError('Message is not found');
    }
    const accountNumber = decrypt(message);
    const accountProfile = await models.Customer.findOne({
      where: {
        account_number: accountNumber,
      },
    });
    if (!accountNumber) {
      res.status(404).send({
        message: 'Account profile not found',
      });
    }
    res.status(200).send({
      account_profile: accountProfile,
    });
  } catch (error) {
    next(new BadRequestError(error.message));
  }
};

module.exports = {
  getAccountProfile,
};
