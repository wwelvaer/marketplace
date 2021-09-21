const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    port: config.PORT,
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// load models
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.listing = require("../models/listing.model.js")(sequelize, Sequelize);
db.booking = require("../models/booking.model.js")(sequelize, Sequelize);
db.category = require("../models/category.model.js")(sequelize, Sequelize);

// add foreign keys
db.listing.belongsTo(db.user, {foreignKey: 'userID'})
db.booking.belongsTo(db.listing, {foreignKey: 'listingID'})
db.booking.belongsTo(db.user, {foreignKey: 'bookerID'})


module.exports = db;