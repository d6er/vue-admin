const apiUser = require('./api/user')
const passport = require('passport')

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  apiUser.getUser(id).then(doc => {
    // todo: remove secret data (accessToken, etc)
    return done(null, doc)
  })
})

module.exports = passport
