"use strict";

module.exports = function(sequelize, DataTypes) {
  var Thing = sequelize.define("Thing", {
    name: DataTypes.STRING,
    info: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  });

  return Thing;
};
