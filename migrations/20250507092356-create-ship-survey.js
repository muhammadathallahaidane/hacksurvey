'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ShipSurveys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ShipId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Ships',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      SurveyId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Surveys',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ShipSurveys');
  }
};