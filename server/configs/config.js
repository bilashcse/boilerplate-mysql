module.exports = {
  name: 'cost-manager',
  port: 3030,
  allowedOrigins: [],
  mysql: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    db: 'boilerplate',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
