"use strict";

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    password: {
    	type: DataTypes.STRING,
    	set: function(password) {
    		this.setDataValue("salt",this.makeSalt());
    		this.setDataValue("hashedPassword",this.encryptPassword(password));
    		this.setDataValue("password", "");
    	}
    },
    provider: DataTypes.STRING,
    salt: DataTypes.STRING
  },{
  	instanceMethods: {
  		/**
  		 * Authenticate - check if the passwords are the same
  		 */
  		authenticate: function(plainText) {
  			return this.encryptPassword(plainText) === this.hashedPassword;
  		},
  		/**
  		 * Encrypt password
  		 */
  		encryptPassword: function(password) {
  			if (!password || !this.salt) return '';
  			var salt = new Buffer(this.salt, 'base64');
  			return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  		},
    	/**
     	 * Make salt
  		 */
  		makeSalt: function() {
  			return crypto.randomBytes(16).toString('base64');
  		}
  	},
    classMethods: {
      associate: function(models) {
        User.hasOne(models.Facebook, {as: "Facebook"});
        User.hasOne(models.Google, {as: "Google"});
        User.hasOne(models.Twitter, {as: "Twitter"});
      }
    }    
  });
  return User;
};

