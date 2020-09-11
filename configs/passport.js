const User = require("../models/user-model");
const LocalStrategy = require("passport-local").Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const bcrypt = require("bcryptjs");
const passport = require("passport");

passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession, (err, userDocument) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, userDocument);
  });
});

passport.use(
  new LocalStrategy((username, password, next) => {
    User.findOne({ username }, (err, foundUser) => {
      if (err) {
        next(err);
        return;
      }

      if (!foundUser) {
        next(null, false, { message: "Incorrect username." });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: "Incorrect password." });
        return;
      }

      next(null, foundUser);
    });
  })
);

passport.use('facebookToken', new FacebookTokenStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("FB Profile :", profile)
        console.log("accessToken :", accessToken)
        console.log("refreshToken :", refreshToken)

        const existingUser = await User.findOne({"facebook.id": profile.id});
        if (existingUser) {
          return done(null, existingUser)
        }

        const newUser = new User({
          username: profile._json.name,
          profilePicture: profile.photos[0].value,
          facebook: {
            id: profile.id,
            token: accessToken,
            email: profile.emails[0].value,
            name: profile.name.givenName
          }
        })

        await newUser.save();
        done(null, newUser);
      } catch(error) {
        done(error, false, error.message)
      }
    })
)