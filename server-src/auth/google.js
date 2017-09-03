const express = require('express');
const passport = require('passport')
const mongo = require('../mongo')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// Passport
passport.use(new GoogleStrategy(
  {
    clientID: '1088034821843-fmeepsu3a7jqmqbcqej74qlu0em9viv4.apps.googleusercontent.com',
    clientSecret: 'alDLTJpR550tFMFtS85-2wqQ',
    callbackURL: "http://localhost:8181/auth/google/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    if (req.user) {
      mongo.connect().then(db => {
        return mongo.addAccount(req.user._id, profile)
      }).then(r => {
        done(null, req.user)
      })
    }
  }
))

// Router
const router = express.Router();

router.get('/',
           passport.authenticate('google',
                                 { scope: 'https://www.googleapis.com/auth/userinfo.profile' }))

router.get('/callback',
           passport.authenticate('google', { failureRedirect: '/login?google-callback-failure' }),
           function(req, res) {
             res.redirect('/user')
           })

module.exports = router
