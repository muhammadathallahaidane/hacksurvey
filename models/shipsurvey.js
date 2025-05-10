'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShipSurvey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    ShipSurvey.belongsTo(models.Ship, { foreignKey: 'ShipId' });
    ShipSurvey.belongsTo(models.Survey, { foreignKey: 'SurveyId' });
    }
  }
  ShipSurvey.init({
    ShipId: DataTypes.INTEGER,
    SurveyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ShipSurvey',
  });
  return ShipSurvey;
};