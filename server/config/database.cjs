require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '11Abc578kxc',
    database: process.env.DB_NAME || 'fashion_app',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  test: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'database_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
}; 