var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

function createFacebook(models, profile, user, done){
  models.Facebook.create({
    facebookId: profile.id,
    profile: JSON.stringify(profile._json)
  }).then(function onFulfill(facebook){
    linkUser(models, user, facebook, done);
  }, function onReject(err){
    return done(err);
  });
}

function linkUser(models, user, facebook, done){
  user.setFacebook(facebook)
  .then(function onFulfill(){
    return done(null, new UserObject(facebook));          
  }, function onReject(err){
    return done(err);
  });
}

function UserObject(facebook) {
  this.fbUser = facebook.User ? facebook.User.toJSON():{};
  this.fbUser.facebook = JSON.parse(facebook.profile);
  this.fbUser._id = this.fbUser.id || facebook.UserId;
  return this.fbUser;
};


exports.setup = function (models, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      models.Facebook.find({where: {
        'facebookId': profile.id
      },
      include: [ models.User ] })
      .then(function onFulfill(facebook) {
        if (!facebook) {
          models.User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: 'user',
            username: profile.username,
            provider: 'facebook'           
          })
          .then(function onFulfill(user){
            createFacebook(models,profile, user, done);
          }, function onReject(err){
            return done(err);
          });
        }
        else {
          return done(null, new UserObject(facebook));          
        }
      }, function onReject(err){
        return done(err);
      });
    }
  ));
};