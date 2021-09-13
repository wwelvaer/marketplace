module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      userID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      authID: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING(7)
      },
      address: {
        type: Sequelize.STRING
      },
      birthDate: {
        type: Sequelize.DATEONLY
      },
      phoneNumber: {
        type: Sequelize.STRING(20)
      }
    }, {
      timestamps: false,
      freezeTableName: true,
    });
  
    return User;
  };