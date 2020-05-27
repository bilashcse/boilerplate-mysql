const db = require('../models');

const createOrReturnTransaction = async (transaction, callback) => {
  if (transaction) {
    return callback(transaction);
  }
  return db.sequelize.transaction(tx => callback(tx));
};

module.exports = {
  createOrReturnTransaction,
};
