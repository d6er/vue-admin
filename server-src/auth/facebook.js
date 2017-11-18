const express = require('express')
const passport = require('passport')
const config = require('../../config/server')
const apiAccount = require('../api/account')
const FacebookStrategy = require('passport-facebook').Strategy

// Passport
passport.use(new FacebookStrategy(
  {
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8181/auth/facebook/callback",
    
    // https://developers.facebook.com/docs/graph-api/reference/v2.5/user
    profileFields: ['id', 'displayName', 'photos', 'email'],
    
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, cb) {
    console.dir(profile)
    if (req.user) {
      apiAccount.addAccount(req.user._id, profile).then(r => {
        cb(null, req.user)
      })
    }
  }
));

// Router
const router = express.Router()

// https://developers.facebook.com/docs/facebook-login/permissions/overview
router.get('/', passport.authenticate('facebook', {
  scope: [ 'email' ]
}))

router.get('/callback',
           passport.authenticate('facebook', { failureRedirect: '/login?facebook-failure' }),
           function(req, res) {
             res.redirect('/settings')
           })

module.exports = router
