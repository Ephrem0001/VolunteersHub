const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const Volunteer = require('../models/Volunteer');
const NGO = require('../models/NGO');

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const userType = req.query.state || 'volunteer';
    
    if (userType === 'volunteer') {
      const user = await Volunteer.findOrCreate({
        provider: 'google',
        profile
      });
      return done(null, user);
    } else {
      const user = await NGO.findOrCreate({
        provider: 'google',
        profile
      });
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'displayName', 'emails', 'photos'],
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const userType = req.query.state || 'volunteer';
    
    if (userType === 'volunteer') {
      const user = await Volunteer.findOrCreate({
        provider: 'facebook',
        profile
      });
      return done(null, user);
    } else {
      const user = await NGO.findOrCreate({
        provider: 'facebook',
        profile
      });
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
}));

// Twitter Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "/api/auth/twitter/callback",
  includeEmail: true,
  passReqToCallback: true
}, async (req, token, tokenSecret, profile, done) => {
  try {
    const userType = req.query.state || 'volunteer';
    
    if (userType === 'volunteer') {
      const user = await Volunteer.findOrCreate({
        provider: 'twitter',
        profile
      });
      return done(null, user);
    } else {
      const user = await NGO.findOrCreate({
        provider: 'twitter',
        profile
      });
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
}));

// Serialization
passport.serializeUser((user, done) => {
  done(null, { id: user._id, type: user.role || 'volunteer' });
});

passport.deserializeUser(async (obj, done) => {
  try {
    let user;
    if (obj.type === 'volunteer') {
      user = await Volunteer.findById(obj.id);
    } else if (obj.type === 'ngo') {
      user = await NGO.findById(obj.id);
    } else {
      user = await Admin.findById(obj.id);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});