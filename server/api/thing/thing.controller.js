/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var models = require('../../models');

// Get list of things
exports.index = function(req, res) {
  models.Thing.findAll().success(function(things){
	//if(err) { return handleError(res, err); }
	return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  models.Thing.findOne({ where: {
	id: req.params.id
  }})
  .then(function onFulfill(thing) { 
	if (!thing) return res.json(404);
	res.json(thing);
  }, function onReject(err){
	return handleError(res, err);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  models.Thing.create(req.body)
  .then(function onFulfill(thing){
	return res.json(201, thing);
  }, function onReject(err){
	handleError(res, err);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
	if(req.body.id) { delete req.body.id; }
	models.Thing.findOne({ where: {
		id: req.params.id
	}})
	.then(function onFulfill(thing) { 
		if (!thing) return res.json(404);
		models.Thing.findOne({ where: {
			id: req.params.id
		}})
		.then(function onFulfill(thing) {
			if(!thing) { return res.send(404); }
			var updated = _.merge(thing, req.body);
			updated.save().then(function onFulfill(){
				return res.json(200, updated);
			}, function onReject(err){
				return handleError(res, err);	
			});
		});
	});
};

// Deletes a thing from the DB.
exports.destroy = function(req, res, next) {
  models.Thing.destroy({ where: {
    id: req.params.id
  }})
  .then(function onFulfill() { 
    return res.send(204);
  }, function onReject(err){
      return next(err);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}