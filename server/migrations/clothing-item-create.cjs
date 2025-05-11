module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ClothingItems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subCategory: {
        type: Sequelize.STRING,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true
      },
      material: {
        type: Sequelize.STRING,
        allowNull: true
      },
      season: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tags: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isUserUploaded: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      uploadDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ClothingItems');
  }
}; 