const { Op } = require('sequelize');
const _ = require('lodash');

const buildQueryOptions = (option, accountNumber) => {
  const data = [
    // 1.
    {
      key: { isSender: true },
      value: { sender_account_number: accountNumber },
    },
    {
      key: { isReceiver: true },
      value: { receiver_account_number: accountNumber },
    },
    {
      key: { isRemind: true },
      value: {
        transaction_type: 3,
        receiver_account_number: accountNumber,
      },
    },
    {
      key: { isBeRemind: true },
      value: {
        transaction_type: 3,
        sender_account_number: accountNumber,
      },
    },
    // 2.
    {
      key: {
        isSender: true,
        isReceiver: true,
      },
      value: {
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
        },
      },
    },
    {
      key: {
        isSender: true,
        isRemind: true,
      },
      value: {
        [Op.or]: {
          sender_account_number: accountNumber,
          [Op.and]: {
            receiver_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    {
      key: {
        isSender: true,
        isBeRemind: true,
      },
      value: {
        [Op.or]: {
          sender_account_number: accountNumber,
          [Op.and]: {
            sender_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    {
      key: {
        isReceiver: true,
        isRemind: true,
      },
      value: {
        [Op.or]: {
          receiver_account_number: accountNumber,
          [Op.and]: {
            receiver_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    {
      key: {
        isReceiver: true,
        isBeRemind: true,
      },
      value: {
        [Op.or]: {
          receiver_account_number: accountNumber,
          [Op.and]: {
            sender_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    {
      key: {
        isRemind: true,
        isBeRemind: true,
      },
      value: {
        transaction_type: 3,
      },
    },
    // 3.
    {
      key: {
        isSender: true,
        isReceiver: true,
        isRemind: true,
      },
      value: {
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
          [Op.and]: {
            receiver_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    {
      key: {
        isSender: true,
        isReceiver: true,
        isBeRemind: true,
      },
      value: {
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
          [Op.and]: {
            sender_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    {
      key: {
        isSender: true,
        isRemind: true,
        isBeRemind: true,
      },
      value: {
        [Op.or]: {
          sender_account_number: accountNumber,
          [Op.and]: {
            receiver_account_number: accountNumber,
            transaction_type: 3,
          },
          [Op.and]: {
            sender_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    {
      key: {
        isReceiver: true,
        isRemind: true,
        isBeRemind: true,
      },
      value: {
        [Op.or]: {
          receiver_account_number: accountNumber,
          [Op.and]: {
            receiver_account_number: accountNumber,
            transaction_type: 3,
          },
          [Op.and]: {
            sender_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
    // 4.
    {
      key: {
        isReceiver: true,
        isRemind: true,
        isBeRemind: true,
        isSender: true,
      },
      value: {
        [Op.or]: {
          sender_account_number: accountNumber,
          receiver_account_number: accountNumber,
          [Op.and]: {
            receiver_account_number: accountNumber,
            transaction_type: 3,
          },
          [Op.and]: {
            sender_account_number: accountNumber,
            transaction_type: 3,
          },
        },
      },
    },
  ];
  const result = data.find(item => {
    return _.isEqual(option, item.key);
  });
  return result;
};

module.exports = {
  buildQueryOptions,
};
