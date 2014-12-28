'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  mysql: {
    username: 'beerigo',
    password: 'beer1g0',
    database: 'beerigo_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  }  
};
