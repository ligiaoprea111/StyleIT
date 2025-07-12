'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('StylePreferences', 'inspirations', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('StylePreferences', 'height', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('StylePreferences', 'weight', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('StylePreferences', 'inspirations');
    await queryInterface.removeColumn('StylePreferences', 'height');
    await queryInterface.removeColumn('StylePreferences', 'weight');
  }
};
