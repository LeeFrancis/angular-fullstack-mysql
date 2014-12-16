'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/beerigo-dev'
  },
  mysql: {
    username: 'beerigo',
    password: 'beer1g0',
    database: 'beerigo_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  },  

  seedDB: true
};
