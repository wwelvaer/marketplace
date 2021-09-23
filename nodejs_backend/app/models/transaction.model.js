module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
      transactionID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numberOfAssets: {
        type: Sequelize.INTEGER
      },
      pricePerAsset: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.ENUM('payed', 'reserved', 'cancelled')
      }
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Transaction;
  };