const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done) {
  console.log('serializeUser')
  console.dir(user)
  done(null, user.name)
})

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser: ' + id)
  done(null, { name: 'foo-user' })
})

// Local
passport.use(new LocalStrategy(
  function(username, password, done) {
    return done(null, { name: username })
  }
))

// Google
passport.use(new GoogleStrategy(
  {
    clientID: '1088034821843-fmeepsu3a7jqmqbcqej74qlu0em9viv4.apps.googleusercontent.com',
    clientSecret: 'alDLTJpR550tFMFtS85-2wqQ',
    callbackURL: "http://localhost:8181/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile)
  }
))

// Twitter


// Facebook


module.exports = passport
