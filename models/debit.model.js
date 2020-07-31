const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Debit = sequelize.define(
    'Debit',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      creator_customer_id: DataTypes.INTEGER, // Người tạo nhắc nợ
      reminder_id: DataTypes.INTEGER, // Số tài khoản người bị nhắc nợ
      amount: DataTypes.FLOAT,
      message: DataTypes.TEXT, // Nội dung nhắc nợ
      payment_status: DataTypes.INTEGER, // false: chưa trả nợ | true: đã trả nợ
      is_notified: DataTypes.INTEGER,
      is_actived: DataTypes.INTEGER,
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE,
    },
    {
      tableName: 'debit',
      timestamps: false,
    }
  );
  Debit.associate = models => {
    Debit.belongsTo(models.Customer, { foreignKey: 'creator_customer_id', target_key: 'id' });
    Debit.belongsTo(models.Customer, { foreignKey: 'reminder_id', target_key: 'id' });
  };
  sequelizePaginate.paginate(Debit);

  return Debit;
};
