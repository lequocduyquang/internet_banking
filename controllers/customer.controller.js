const { BadRequestError } = require('@sgjobfit/common');
const models = require('../models');

const { Customer } = models;

const createContact = async (req, res, next) => {
  try {
    const { reminder_name: name, account_number: account } = req.body;
    const customer = await Customer.findOne({
      where: {
        id: req.user.id,
      },
    });
    const isExistContact = await Customer.findOne({
      where: {
        account_number: account,
      },
    });
    if (!isExistContact) {
      console.log('Contact is not found');
    }
    customer.list_contact.push({
      reminder_name: name,
      account_number: account,
    });
    await customer.update(
      {
        list_contact: customer.list_contact,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    res.status(201).send({
      message: 'OK',
    });
  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
};

const getAllContacts = async (req, res, next) => {
  try {
    const listContacts = await Customer.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['list_contact'],
    });
    res.status(200).send({
      contacts: listContacts,
    });
  } catch (error) {
    next(new BadRequestError(`${error.message}`));
  }
};

module.exports = {
  createContact,
  getAllContacts,
};
