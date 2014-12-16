"use strict";

module.exports = function(sequelize, DataTypes) {
  /* One way Associations */
  var Facebook = sequelize.define("Facebook", {
    facebookId: DataTypes.STRING,
    profile: DataTypes.TEXT
  },{
    classMethods: {
      associate: function(models) {
        Facebook.belongsTo(models.User);
      }
    }  	
  });
  return Facebook;
}
