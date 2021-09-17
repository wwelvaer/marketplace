module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define("booking", {
      bookingID: {
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
    }, {
      timestamps: false,
      freezeTableName: true,
    });
    return Booking;
  };