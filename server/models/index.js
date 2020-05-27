const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const dbConfig = require('../configs/config.js').mysql;

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.models = [];
fs.readdirSync(__dirname)
  .filter((file) => file.indexOf('.js') > 0 && file !== 'index.js')
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
    db.models.push(model.name);
  });
// As we have foreign key constrain,
// therefore models should follow correct order
db.models.sort((a, b) => db[a].serial - db[b].serial);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Association of relational models
Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});
// db.tutorials = require('./tutorial.model.js')(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.closeConnection = () => {
  sequelize.close();
};
module.exports = db;
