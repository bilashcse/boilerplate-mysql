const db = require('../../models');

const getAllUsers = async ({ role, name, phone }) => {
  const sqlConditions = {
    where: {},
  };
  if (role) {
    sqlConditions.where.ROLE = role;
  }

  if (name) {
    sqlConditions.where.NAME = {
      $like: `%${name}%`,
    };
  }
  if (phone) {
    sqlConditions.where.PHONE = {
      $like: `%${phone}%`,
    };
  }

  const users = await db.User.findAll(sqlConditions).map((p) => p.get({ plain: true }));
  return users;
};

const createUser = async (body) => {
  await db.User.create(body);
};

const updateUser = async (body, userId) => {
  await db.User.update(body, {
    where: {
      ID: userId,
    },
  });
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
};
