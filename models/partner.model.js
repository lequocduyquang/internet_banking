const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define(
    'Partner',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE,
    },
    {
      tableName: 'partner',
      timestamps: false,
    }
  );

  sequelizePaginate.paginate(Partner);

  Partner.associate = models => {
    Partner.hasMany(models.TransactionLog, { foreignKey: 'partner_code' });
  };

  return Partner;
};
