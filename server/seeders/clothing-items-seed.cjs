const fs = require('fs');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Read the styles.json file
      const stylesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/styles.json'), 'utf8'));
      
      // Transform the data for database insertion
      const itemsToInsert = stylesData.items.map(item => ({
        userId: 2, // Your test account
        productId: item.productId,
        name: item.name,
        category: item.category,
        subCategory: item.subCategory,
        imageUrl: item.imageUrl,
        color: item.color,
        material: item.material,
        season: item.season,
        description: item.description,
        tags: item.tags,
        isUserUploaded: false,
        uploadDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await queryInterface.bulkInsert('ClothingItems', itemsToInsert);
      console.log('Successfully seeded clothing items for user 2');
    } catch (error) {
      console.error('Error seeding clothing items:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkDelete('ClothingItems', { userId: 2 });
      console.log('Successfully removed clothing items for user 2');
    } catch (error) {
      console.error('Error removing clothing items:', error);
      throw error;
    }
  }
};

// Helper function to determine season based on category and usage
function determineSeason(subCategory, usage) {
  const subCategoryLower = subCategory.toLowerCase();
  const usageLower = usage.toLowerCase();

  if (usageLower.includes('summer') || subCategoryLower.includes('summer')) return 'summer';
  if (usageLower.includes('winter') || subCategoryLower.includes('winter')) return 'winter';
  if (usageLower.includes('spring') || subCategoryLower.includes('spring')) return 'spring';
  if (usageLower.includes('fall') || subCategoryLower.includes('fall')) return 'fall';

  // Default to spring/summer for smart casual items
  return 'spring-summer';
} 