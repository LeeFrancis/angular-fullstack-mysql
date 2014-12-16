var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (models, config) {
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    function(email, password, done) {
      models.User.find({where: {
        'email': email.toLowerCase()
      }})
      .then(function onFulfill(user) {
        if (!user) {
          return done(null, false, { message: 'This email is not registered.' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'This password is not correct.' });
        }
        return done(null, user);
      }, function onReject(err){
        if (err) return done(err);
      });
    }
  ));
};