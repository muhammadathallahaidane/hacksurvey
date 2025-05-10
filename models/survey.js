'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Survey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Survey.belongsToMany(models.Ship, {
        through: 'ShipSurvey'
      });
    }
  }
  Survey.init({
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Survey',
  });
  return Survey;
};