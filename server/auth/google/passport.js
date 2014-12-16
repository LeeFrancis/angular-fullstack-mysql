var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

function createGoogle(models, profile, user, done){
  models.Google.create({
    googleId: profile.id,
    profile: JSON.stringify(profile._json)
  }).then(function onFulfill(google){
    linkUser(models, user, google, done);
  }, function onReject(err){
    return done(err);
  });
}

function linkUser(models, user, google, done){
  user.setGoogle(google)
  .then(function onFulfill(){
    return done(null, new UserObject(google));          
  }, function onReject(err){
    return done(err);
  });
}

function UserObject(google) {
  this.googleUser = google.User ? google.User.toJSON():{};
  this.googleUser.google = JSON.parse(google.profile);
  this.googleUser._id = this.googleUser.id || google.UserId;
  return this.googleUser;
};


exports.setup = function (models, config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      models.Google.find({where: {
        'googleId': profile.id
      },
      include: [ models.User ] })
      .then(function onFulfill(google) {
        if (!google) {
          models.User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'google'
          })
          .then(function onFulfill(user){
            createGoogle(models,profile, user, done);
          }, function onReject(err){
            return done(err);
          });
        }
        else {
          return done(null, new UserObject(google));          
        }
      }, function onReject(err){
        return done(err);
      });
    }
  ));
};
