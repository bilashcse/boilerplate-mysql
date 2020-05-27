module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      NAME: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PHONE: {
        type: DataTypes.STRING(20),
        validate: {
          is: {
            args: [/^(\+880|880|0)1(1|[3-9])[0-9]{8}$/],
            msg:
              'Please type your phone number in the following format: 01xxxxxxxxx or 8801xxxxxxxxx or +8801xxxxxxxxx',
          },
        },
        allowNull: false,
      },
      ROLE: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          hasStatus(value) {
            const arr = ['owner', 'employee'];
            if (arr.indexOf(value.toLowerCase()) < 0) {
              throw new Error('Undefined module');
            }
          },
        },
      },
      STATUS: {
        type: DataTypes.STRING,
        defaultValue: 'active',
      },
    },
    {
      tableName: 'sl_users',
      classMethods: {
        serial: 1,
        CREATED_AT: 'CREATED_AT',
        UPDATED_AT: 'UPDATED_AT',
      },
    },
  );

  return User;
};
