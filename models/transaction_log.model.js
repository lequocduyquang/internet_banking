const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const TransactionLog = sequelize.define(
    'TransactionLog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      transaction_type: DataTypes.STRING, // "INTERNAL" || "PARTNER"
      transaction_method: DataTypes.INTEGER, // 1: tru phi nguoi gui, 2: tru phi nguoi nhan
      is_actived: DataTypes.BOOLEAN,
      is_notified: DataTypes.BOOLEAN,
      sender_account_number: DataTypes.STRING,
      receiver_account_number: DataTypes.STRING,
      amount: DataTypes.DOUBLE,
      message: DataTypes.STRING,
      partner_code: DataTypes.STRING,
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE,
    },
    {
      tableName: 'transaction_log',
      timestamps: false,
    }
  );

  TransactionLog.associate = models => {
    TransactionLog.belongsTo(models.Partner, { foreignKey: 'partner_code', target_key: 'code' });
  };

  TransactionLog.associate = models => {
    TransactionLog.belongsTo(models.TransactionType, {
      foreignKey: 'transaction_type',
      target_key: 'id',
    });
  };

  sequelizePaginate.paginate(TransactionLog);
  return TransactionLog;
};
