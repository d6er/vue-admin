const express = require('express')
const passport = require('passport')
const config = require('../../config/server')
const mongo = require('../mongo')
const Auth0Strategy = require('passport-auth0').Strategy

// Passport
passport.use(new Auth0Strategy(
  {
    domain: config.AUTH0_DOMAIN,
    clientID: config.AUTH0_CLIENT_ID,
    clientSecret: config.AUTH0_CLIENT_SECRET,
    callbackURL: 'http://localhost:8181/auth/auth0/callback',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
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
const router = express.Router()

router.get('/', passport.authenticate('auth0'))

router.get('/callback',
           passport.authenticate('auth0', { failureRedirect: '/login?google-callback-failure' }),
           function(req, res) {
             res.redirect('/settings')
           })

module.exports = router

