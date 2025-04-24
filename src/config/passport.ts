import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const existingUser = await User.findOne({ email: profile.emails?.[0].value });
      if (existingUser) return done(null, existingUser);

      const newUser = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0].value,
        password: '', // placeholder
        isAdmin: false,
      });
      done(null, newUser);
    }
  )
);

// Required for session support
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
