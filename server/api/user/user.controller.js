'use strict';

var models = require('../../models');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  models.User.findAll({attributes:['email', 'name', 'role', 'id']})
  .then(function onFulfill(users){
    res.json(200, users);
  }, function onReject(err) {
    return res.send(500, err);
  });
};

/**
 * Creates a new user - NOT TESTED
 */
exports.create = function (req, res, next) {
  req.body.provider = 'local';
  req.body.role = 'user';
  models.User.create(req.body).
  then(function onFulfill(user){
    var token = jwt.sign({id: user.id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  }, function onReject(err){
    validationError(res, err);
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  models.User.findOne({ where: {
    id: req.params.id
  },
  attributes:['email', 'name', 'role', 'id'] // don't ever give out the password or salt
  })
  .then(function onFulfill(user) { 
    if (!user) return res.json(401);
    res.json(user);
  }, function onReject(err){
    return next(err);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res, next) {
  models.User.destroy({ where: {
    id: req.params.id
  }})
  .then(function onFulfill() { 
    return res.send(204);
  }, function onReject(err){
      return next(err);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  models.User.findOne({ where: {
    id: req.user.id
  }})
  .then(function onFulfill(user) {
    if(user.authenticate(oldPass)) {
      user.update({password: newPass})
      .then(function onFulfill(){
        res.send(200);
      }, function onReject(err) {
        validationError(res, err);
      });
    }
    else {
      res.send(403);
    }
  }, function onReject(err){
      return next(err);
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user.id;
  models.User.find({ where: {
      id: userId
    },
    attributes:['email', 'name', 'role', 'id'] // don't ever give out the password or salt
  })
  .then(function onFulfill(user) { 
    if (!user) return res.json(401);
    res.json(user);
  }, function onReject(err){
    if (err) return next(err);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
