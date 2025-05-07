const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.DB_PORT,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model
db.users = require("./user.model.js")(sequelize, Sequelize);
db.books = require("./book.model.js")(sequelize, Sequelize);
db.peminjaman = require("./peminjaman.model.js")(sequelize, Sequelize);

// Relasi
db.books.hasMany(db.peminjaman, {
  as: "peminjaman",
  foreignKey: "bookId",
});
db.peminjaman.belongsTo(db.books, {
  foreignKey: "bookId",
  as: "book",
});

db.users.hasMany(db.peminjaman, {
  as: "peminjaman",
  foreignKey: "userId",
});
db.peminjaman.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;
