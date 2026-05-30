const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails[0].value;

        const user = await User.findOne({ email: googleEmail });

        // If account exists, login directly
        if (user) {
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }

          return done(null, user);
        }

        // If account does not exist, mark as pending signup
        return done(null, {
          isNewGoogleUser: true,
          googleId: profile.id,
          email: googleEmail,
          name: profile.displayName
        });

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;