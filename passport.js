const db_connect = require('./db')
const passport = require('passport')

const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const Auth0Strategy = require('passport-auth0').Strategy;

passport.serializeUser(function(user, done) {
  console.log('[serializeUser]')
  console.dir(user)
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  db_connect.then(db => {
    db.collection('users').findOne({ _id: id }).then(doc => {
      return done(null, doc)
    })
  })
})

// Local
passport.use(new LocalStrategy(
  function(username, password, done) {
    db_connect.then(db => {
      db.collection('users').findOne({
        username: username,
        password: password
      }).then(doc => {
        return done(null, doc)
      })
    })
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


// Auth0
passport.use(new Auth0Strategy(
  {
    domain: 'd6er.auth0.com',
    clientID: 'FJJtRAN2B45f6SigcjeyiNF_0TX-Qjav',
    clientSecret: 'f8Fw4LAuZBGLJ344ROLJJQHFNEbXU7tdjS02HKZIQfEiDUcsGtVRB9rW2zCIP5_7',
    callbackURL: 'http://localhost:8181/auth/auth0/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
))

module.exports = passport
