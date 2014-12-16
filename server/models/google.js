"use strict";

module.exports = function(sequelize, DataTypes) {
  /* One way Associations */
  var Google = sequelize.define("Google", {
    googleId: DataTypes.STRING,
    profile: DataTypes.TEXT
  },{
    classMethods: {
      associate: function(models) {
        Google.belongsTo(models.User);
      }
    }  	
  });
  return Google;
}
