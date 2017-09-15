const express = require('express');
const passport = require('passport')
const mongo = require('../mongo')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Passport
passport.use(new GoogleStrategy(
  {
    clientID: '1088034821843-fmeepsu3a7jqmqbcqej74qlu0em9viv4.apps.googleusercontent.com',
    clientSecret: 'alDLTJpR550tFMFtS85-2wqQ',
    callbackURL: "http://localhost:8181/auth/google/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, cb) {

    // todo: change structure, don't put accessToken to profile object
    profile.accessToken = accessToken
    profile.refreshToken = refreshToken
    
    if (req.user) {
      mongo.connect().then(db => {
        return mongo.addAccount(req.user._id, profile)
      }).then(r => {
        cb(null, req.user)
      })
    }
  }
))

// Router
const router = express.Router();

// https://github.com/jaredhanson/passport-google-oauth2/issues/27#issuecomment-313969184
router.get('/', passport.authenticate('google', {
  scope:
  ['https://www.googleapis.com/auth/userinfo.profile',
   'https://www.googleapis.com/auth/userinfo.email',
   'https://www.googleapis.com/auth/gmail.readonly'],
  accessType: 'offline',
  prompt: 'consent',
  successRedirect: '/settings',
  failureRedirect: '/settings'
}))

router.get('/callback',
           passport.authenticate('google', { failureRedirect: '/login?google-callback-failure' }),
           function(req, res) {
             res.redirect('/settings')
           })

module.exports = router
