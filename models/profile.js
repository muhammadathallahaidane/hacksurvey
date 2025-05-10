'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User, {
        foreignKey: 'UserId'
      })

      Profile.hasMany(models.Ship, {
        foreignKey: 'ProfileId'
      })

    }
  }
  Profile.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Full Name can't be empty"
        },
        notNull: {
          args: true,
          msg: "Full Name can't be empty"
        }
      }
    },
    city:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "City can't be empty"
        },
        notNull: {
          args: true,
          msg: "City can't be empty"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Age can't be empty"
        },
        notNull: {
          args: true,
          msg: "Age can't be empty"
        },
        isLegal(value) {
            if (value < 18) {
            throw new Error('Owner/Surveyor has to be legal working age')
          }
        }

      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};