'use strict'

const api = require('./api-server')
const mongo = require('./mongo')

const fs = require('fs')
const ws = require('ws')
const url = require('url')
const http = require('http')
const express = require('express')
const session = require('express-session')
const passport = require('./passport')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(session)

const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync('./src/index.template.html', 'utf-8')

mongo.connect().then(db => {
  
  api.db = db
  
  // development
  let serverBundle, clientManifest, renderer

  // production
  /*
    let serverBundle = require('./dist/vue-ssr-server-bundle.json')
    let clientManifest = require('./dist/vue-ssr-client-manifest.json')
    let renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false,
    template,
    clientManifest
    })
  */
  
  const app = express()

  // Development
  let promise
  if (process.env.NODE_ENV === 'development') {
    promise = require('./build/setup-dev-server')(app, (serverBundle, clientManifest) => {
      renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template,
        clientManifest
      })
    })
  }
  
  const sessionParser = session({
    store: new MongoStore({ db: db }),
    secret: '$eCuRiTy',
    resave: true,
    saveUninitialized: true
  })
  
  app.use(sessionParser)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(bodyParser.urlencoded({ extended: false }))
  
  
  app.use('/dist', express.static('dist'))
  
  /*
  app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                      failureRedirect: '/login',
                                                      failureFlash: true }))
  */
  app.post('/login', passport.authenticate('local'), (req, res) => {
    if (req.body.redirect) {
      res.redirect(req.body.redirect)
    } else {
      res.redirect('/list')
    }
  })
  
  // http://stackoverflow.com/questions/33112299/how-to-delete-cookie-on-logout-in-express-passport-js
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  
  app.get('/auth/google',
          passport.authenticate('google',
                                { scope: 'https://www.googleapis.com/auth/userinfo.profile' }))

  app.get('/auth/google/callback',
          passport.authenticate('google', { failureRedirect: '/?google-callback-failure' }),
          function(req, res) {
            console.dir(req.user)
            res.redirect('/?google-callback-success');
          })

  app.get('/auth/auth0',
          passport.authenticate('auth0'))
  
  app.get('/auth/auth0/callback',
          passport.authenticate('auth0', { failureRedirect: '/?auth0-callback-failure' }),
          function(req, res) {
            console.dir(req.user)
            res.redirect('/?auth0-callback-success');
          })
  
  app.get('/favicon.ico', (req, res) => {
    res.end()
  })
  
  // https://forum.vuejs.org/t/accessing-current-request-context-through-vue-instance-for-server-side-rendering-to-be-able-to-access-cookies-for-initial-user-authentication/48/11
  app.get('*', (req, res) => {
    
    console.log(req.url)
    
    const context = {
      title: 'vue-admin',
      url: req.url,
      isAuthenticated: req.isAuthenticated()
    }
    
    if (req.isAuthenticated()) {
      context.user = req.user
    } else {
      delete context.user
    }
    
    promise.then(() => {
      renderer.renderToString(context, (err, html) => {
        res.end(html)
      })
    })
  })

  const server = http.createServer(app);
  
  // https://github.com/websockets/ws/blob/master/examples/express-session-parse/index.js
  const wss = new ws.Server({
    verifyClient: (info, done) => {
      sessionParser(info.req, {}, () => {
        done(true)
      })
    },
    server
  })
  
  wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
      
      console.log('[WebSocket]')
      console.dir(req.session)
      
      const data = JSON.parse(message)
      
      console.dir(data)
      
      if (!api[data.action]) {
        return
      }
      
      api[data.action](data.payload).then(
        r => {
          ws.send(JSON.stringify({
            jobid: data.jobid,
            resolve: r
          }))
        },
        e => {
          ws.send(JSON.stringify({
            jobid: data.jobid,
            reject: e
          }))
        }
      )
      
    })
  })
  
  server.listen(8181, function listening() {
    console.log('Listening on %d', server.address().port);
  })

}).catch(err => {
  console.log(err.message)
})
