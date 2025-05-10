'use strict';
const {
  Model
} = require('sequelize')
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, {
        foreignKey: 'UserId'
      })
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "username can't be empty"
        },
        notNull: {
          args: true,
          msg: "username can't be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "email can't be empty"
        },
        notNull: {
          args: true,
          msg: "email can't be empty"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "password can't be empty"
        },
        notNull: {
          args: true,
          msg: "password can't be empty"
        },
        len: {
          args: [6,20],
          msg: "password must be 6-20 character"
        },
      }
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: async (instance) => {
        const salt = await bcrypt.genSalt(8);
        instance.password = await bcrypt.hash(instance.password, salt);
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};