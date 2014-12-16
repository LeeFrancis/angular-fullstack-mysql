'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/beerigo-test'
  },
  mysql: {
    username: 'beerigo',
    password: 'beer1g0',
    database: 'beerigo_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  }  
};