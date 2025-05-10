'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile('./surveys.json', 'utf-8')).map(el => {
      delete el.id,
      el.createdAt = el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Surveys', data)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Surveys', null, {})
  }
};