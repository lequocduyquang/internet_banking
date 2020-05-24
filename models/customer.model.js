const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      account_number: DataTypes.STRING,
      account_balance: DataTypes.FLOAT,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE,
    },
    {
      tableName: 'customer',
      timestamps: false,
    }
  );

  Customer.prototype.updateBalance = function (amount) {
    const customer = this;
    return new Promise(resolve => {
      customer.account_balance += amount;
      resolve(customer);
    });
  };

  sequelizePaginate.paginate(Customer);
  return Customer;
};
