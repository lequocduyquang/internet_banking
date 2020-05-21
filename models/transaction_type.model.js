const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const TransactionType = sequelize.define(
    'TransactionType',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: DataTypes.STRING,
    },
    {
      tableName: 'transaction_type',
      timestamps: false,
    }
  );

  sequelizePaginate.paginate(TransactionType);

  TransactionType.associate = models => {
    TransactionType.hasMany(models.TransactionLog, { foreignKey: 'transaction_type' });
  };
  return TransactionType;
};
