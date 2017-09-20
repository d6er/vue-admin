const express = require('express')
const passport = require('passport')
const config = require('../../config/server')
const mongo = require('../mongo')
const TwitterStrategy = require('passport-twitter').Strategy

// Passport
passport.use(new TwitterStrategy(
  {
    consumerKey: config.TWITTER_CONSUMER_KEY,
    consumerSecret: config.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:8181/auth/twitter/callback",
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
const router = express.Router()

// https://developers.facebook.com/docs/facebook-login/permissions/overview
router.get('/', passport.authenticate('twitter'))

router.get('/callback',
           passport.authenticate('twitter', { failureRedirect: '/login?twitter-failure' }),
           function(req, res) {
             res.redirect('/settings')
           })

module.exports = router
