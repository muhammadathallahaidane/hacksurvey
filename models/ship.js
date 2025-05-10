'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ship extends Model {

    static associate(models) {
      Ship.belongsTo(models.Profile, {
        foreignKey: 'ProfileId'
      })

      Ship.belongsToMany(models.Survey, {
        through: 'ShipSurvey'
      });

    }

    static shipByProfile(inputFromController) {
      let shipByProfile = {
        order: [
          ['yearBuilt', 'ASC']
        ],
        include: [{
          model: sequelize.models.Survey
        }],
        where: {
        }
      }

      if (inputFromController) {
        shipByProfile.where.ProfileId = inputFromController
      }

      return Ship.findAll(shipByProfile)
    }

    get addMVtoName() {
      let newName = `MV ${this.name}`
      return newName
    }

    // get yearOnly() {
    //   let calendarFormat = new Date(this.yearBuilt)
    //   let yearOnly = calendarFormat.getFullYear()
    //   return yearOnly
    //   // return new Date(this.yearBuilt).toISOString().split("T")[0]
    // }

  }
  Ship.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Ship Name can't be empty"
        },
        notNull: {
          args: true,
          msg: "Ship Name can't be empty"
        }
      }
    },
    IMONumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "IMO Number can't be empty"
        },
        notNull: {
          args: true,
          msg: "IMO Number can't be empty"
        }
      }
    },
    yearBuilt: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Year Built can't be empty"
        },
        notNull: {
          args: true,
          msg: "Year Built can't be empty"
        }
      }
    },
    portRegistry: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Port of Registry can't be empty"
        },
        notNull: {
          args: true,
          msg: "Port of Registry can't be empty"
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Image Url can't be empty"
        },
        notNull: {
          args: true,
          msg: "Image Url can't be empty"
        }
      }
    },
    ProfileId: DataTypes.INTEGER,
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: "Ship Type can't be empty"
        },
        notNull: {
          args: true,
          msg: "Ship Type can't be empty"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Ship',
  });
  return Ship;
};