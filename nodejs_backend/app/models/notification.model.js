module.exports = (sequelize, Sequelize) => {
    const Notification = sequelize.define("notification", {
      notificationID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('new transaction', 'cancellation', 'payment confirmation'),
        allowNull: false,
      },
      viewed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
      }
    }, {
        timestamps: false,
        freezeTableName: true,
    });
    
    return Notification;
}
