import apiUser from './api/user'
import passport from 'passport'

passport.serializeUser(function(user, done) {
  done(null, user._id)
})

passport.deserializeUser(function(id, done) {
  apiUser.getUser(id).then(doc => {
    // todo: remove secret data (accessToken, etc)
    console.log('passport.mjs')
    console.dir(doc)
    return done(null, doc)
  })
})

export { passport }
