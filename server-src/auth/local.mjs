import express from 'express'
import passport from 'passport'
import mongo from '../mongo'
import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy

// Passport
passport.use(new LocalStrategy(
  function(username, password, done) {
    mongo.connect().then(db => {
      db.collection('users').findOne({
        username: username,
        password: password
      }).then(doc => {
        return done(null, doc)
      })
    })
  }
))

// Router
const router = express.Router()

router.post('/login', passport.authenticate('local'), (req, res) => {
  const path = req.body.redirect ? req.body.redirect : '/'
  res.redirect(path)
})

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

export default router
