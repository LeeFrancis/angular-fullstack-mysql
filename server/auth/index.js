'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var models = require('../models');


// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(user, done) {
	done(null, user);
});


// Passport Configuration
require('./local/passport').setup(models, config);
require('./facebook/passport').setup(models, config);
require('./google/passport').setup(models, config);
require('./twitter/passport').setup(models, config);

var router = express.Router();

router.use('/local', require('./local'));
router.use('/facebook', require('./facebook'));
router.use('/twitter', require('./twitter'));
router.use('/google', require('./google'));

module.exports = router;