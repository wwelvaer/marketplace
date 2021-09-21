module.exports = (sequelize, Sequelize) => {
    const Listing = sequelize.define("listing", {
      listingID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      availableAssets: {
        type: Sequelize.INTEGER
      },
      startDate: {
        type: Sequelize.DATEONLY
      },
      price: {
        type: Sequelize.DOUBLE
      },
      picture: { // base64 string
        type: Sequelize.STRING
      },
    }, {
      timestamps: false,
      freezeTableName: true,
    });
  
    return Listing;
  };