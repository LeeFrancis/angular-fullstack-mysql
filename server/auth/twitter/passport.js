var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;


function createTwitter(models, profile, user, done){
  models.Twitter.create({
    twitterId: profile.id,
    profile: JSON.stringify(profile._json)
  }).then(function onFulfill(twitter){
    linkUser(models, user, twitter, done);
  }, function onReject(err){
    return done(err);
  });
}

function linkUser(models, user, twitter, done){
  user.setTwitter(twitter)
  .then(function onFulfill(){
    return done(null, new UserObject(twitter));          
  }, function onReject(err){
    return done(err);
  });
}

function UserObject(twitter) {
  this.twitterUser = twitter.User ? twitter.User.toJSON():{};
  this.twitterUser.twitter = JSON.parse(twitter.profile);
  this.twitterUser._id = this.twitterUser.id || twitter.UserId;
  return this.twitterUser;
};


exports.setup = function (models, config) {
  passport.use(new TwitterStrategy({
      consumerKey: config.twitter.clientID,
      consumerSecret: config.twitter.clientSecret,
      callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      models.Twitter.find({where: {
        'twitterId': profile.id
      },
      include: [ models.User ] })
      .then(function onFulfill(twitter) {
        if (!twitter) {
          models.User.create({
            name: profile.displayName,
            username: profile.username,
            role: 'user',
            provider: 'twitter',
            twitter: profile._json
          })
          .then(function onFulfill(user){
            createTwitter(models,profile, user, done);
          }, function onReject(err){
            return done(err);
          });
        }
        else {
          return done(null, new UserObject(twitter));          
        }
      }, function onReject(err){
        return done(err);
      });
    }
  ));
};
