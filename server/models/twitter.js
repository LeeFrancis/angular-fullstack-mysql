"use strict";

module.exports = function(sequelize, DataTypes) {
  /* One way Associations */
  var Twitter = sequelize.define("Twitter", {
    twitterId: DataTypes.STRING,
    profile: DataTypes.TEXT
  },{
    classMethods: {
      associate: function(models) {
        Twitter.belongsTo(models.User);
      }
    }  	
  });
  return Twitter;
}
