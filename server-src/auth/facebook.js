const express = require('express');
const passport = require('passport')
const mongo = require('../mongo')
const FacebookStrategy = require('passport-facebook').Strategy;

// Passport
passport.use(new FacebookStrategy(
  {
    clientID: 'dummy',
    clientSecret: 'dummy',
    callbackURL: "http://localhost:8181/auth/facebook/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, cb) {
    console.dir(profile)
    if (req.user) {
      mongo.connect().then(db => {
        return mongo.addAccount(req.user._id, profile)
      }).then(r => {
        cb(null, req.user)
      })
    }
  }
));

// Router
const router = express.Router();

router.get('/', passport.authenticate('facebook'))

router.get('/callback',
           passport.authenticate('facebook', { failureRedirect: '/login?facebook-failure' }),
           function(req, res) {
             res.redirect('/settings')
           })

module.exports = router
