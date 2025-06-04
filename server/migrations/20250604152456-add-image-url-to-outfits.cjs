'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // Add image_url column to the Outfits table
    await queryInterface.addColumn('Outfits', 'image_url', {
      type: Sequelize.STRING,
      allowNull: true, // image_url can be null if an outfit doesn't have an image
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Remove image_url column from the Outfits table
    await queryInterface.removeColumn('Outfits', 'image_url');
  }
};
