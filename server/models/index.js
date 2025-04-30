import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';


const require = createRequire(import.meta.url);
const configFile = require('../config/config.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const db = {};
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const files = fs.readdirSync(__dirname).filter(file => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    !file.includes('.test.js')
  );
});

for (const file of files) {
  const filePath = pathToFileURL(path.join(__dirname, file)).href;
  const { default: modelFunc } = await import(filePath);
  const model = modelFunc(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Set up manual association: User hasOne Profile
if (db.User && db.Profile) {
  db.User.hasOne(db.Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
  db.Profile.belongsTo(db.User, { foreignKey: 'userId' });
}


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
