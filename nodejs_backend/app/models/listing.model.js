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
      categories: {
        type: Sequelize.STRING,
        get() {
          let v = this.getDataValue('categories');
          return v ? v.split(';') : []
        },
        set(val=[]) {
          this.setDataValue('categories', val ? val.join(';'): []);
        },
      }
    }, {
      timestamps: false,
      freezeTableName: true,
    });
  
    return Listing;
  };