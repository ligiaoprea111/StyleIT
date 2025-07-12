'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StylePreferences', 'avoided_outfits', 'dislikes');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('StylePreferences', 'dislikes', 'avoided_outfits');
  }
};
