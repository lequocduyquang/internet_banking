const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Debits = sequelize.define(
    'Debits',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      creator_customer_id: DataTypes.INTEGER, // Người tạo nhắc nợ
      reminder_id: DataTypes.STRING, // Số tài khoản người bị nhắc nợ
      amount: DataTypes.FLOAT,
      message: DataTypes.TEXT, // Nội dung nhắc nợ
      payment_status: DataTypes.BOOLEAN, // false: chưa trả nợ | true: đã trả nợ
      is_notified: DataTypes.BOOLEAN,
      is_actived: DataTypes.BOOLEAN,
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE,
    },
    {
      tableName: 'Debits',
      timestamps: false,
    }
  );

  sequelizePaginate.paginate(Debits);

  Debits.associate = models => {
    Debits.belongsTo(models.Customer, { foreignKey: 'creator_customer_id', target_key: 'id' });
    Debits.belongsTo(models.Customer, { foreignKey: 'reminder_id', target_key: 'id' });
  };
  return Debits;
};
