const mongo = require('./mongo')
const passport = require('passport')

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  mongo.connect().then(db => {
    db.collection('users').findOne({ _id: id, deleted: { $ne: true } }).then(doc => {
      // todo: remove secret data (accessToken, etc)
      return done(null, doc)
    })
  })
})

module.exports = passport
