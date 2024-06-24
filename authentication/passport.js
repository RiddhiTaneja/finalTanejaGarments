const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENTID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4444/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
    try {
        const user = await User.findOne({ googleId: profile.id });
    if (user) {
        return done(null, user);
    }
    const newUser = await User.create({
        googleId: profile.id,
        username: profile.displayName,
        googleAccessToken: accessToken,
        googleImg: profile.picture
    });
    return done(null, newUser);
} catch (err) {
    done(err);
}
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));



//strategy ko congfigure krna
passport.use(new LocalStrategy(

    async function(username, password, done) {
    try {
        const user  = await User.findOne({username:username});
        if(!user){
            return done(null,false);

        }
        bcrypt.compare(password, user.password, function(err, result) {
            // result == true
            if(!result) return done(null,false);
            return done(null,user);
        });
    } catch (err) {
        done(err);
    }
    }
        // working smjna main kaam h 
    // username password user dega done ek callback function h callback function vo hote h jo ek paarticular kam complete hone k baad perform krega
    // passport ki jo localstartegy define kri h middleware me pass kri h 
    //   User.findOne({ username: username }, function (err, user) {
    //     if (err) { return done(err); }
    //     if (!user) { return done(null, false); }
    //     if (!user.verifyPassword(password)) { return done(null, false); }
    //     return done(null, user);
    //   });
  ));

//Passport setup
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
        let user = await User.findOne({_id : id});
done(null , user);
    } catch (err) {
        done(err);
    }
    // User.findById(id, function (err, user) {
    //   done(err, user);
    // });
  });

module.exports = passport ;