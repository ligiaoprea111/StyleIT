import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dbConfig = require('../config/database.cjs').development;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  }
);

async function updateStyles() {
  try {
    // Read the styles.json file
    const stylesPath = path.join(__dirname, '../data/styles.json');
    const stylesData = JSON.parse(fs.readFileSync(stylesPath, 'utf8'));

    // Connect to the database
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Update or insert each item in the database
    for (const item of stylesData.items) {
      await sequelize.query(
        `INSERT INTO ClothingItems 
          (productId, name, category, subCategory, imageUrl, color, material, season, description, tags, userId)
         VALUES 
          (:productId, :name, :category, :subCategory, :imageUrl, :color, :material, :season, :description, :tags, :userId)
         ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          category = VALUES(category),
          subCategory = VALUES(subCategory),
          imageUrl = VALUES(imageUrl),
          color = VALUES(color),
          material = VALUES(material),
          season = VALUES(season),
          description = VALUES(description),
          tags = VALUES(tags),
          userId = VALUES(userId)
        `,
        {
          replacements: {
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
            userId: 1
          }
        }
      );
      console.log(`Upserted item: ${item.name}`);
    }

    console.log('All styles have been updated successfully!');
  } catch (error) {
    console.error('Error updating styles:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the update
updateStyles();