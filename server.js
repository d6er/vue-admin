'use strict'

const fs = require('fs')
const ws = require('ws')
const url = require('url')
const http = require('http')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const MongoStore = require('connect-mongo')(session)

const config = require('./config')
const mongo = require('./src-server/mongo')
const passport = require('./src-server/passport')

const template = fs.readFileSync('./src/index.template.html', 'utf-8')
//const template = fs.readFileSync('./src-uikit/index.template.html', 'utf-8')
const { createBundleRenderer } = require('vue-server-renderer')

mongo.connect(config.mongo_url).then(db => {
  
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
  
  app.get('/favicon.ico', (req, res) => {
    res.end()
  })
  
  // Username/Password
  app.post('/login', passport.authenticate('local'), (req, res) => {
    const path = req.body.redirect ? req.body.redirect : '/list'
    res.redirect(path)
  })
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  
  // Google
  app.get('/auth/google',
          passport.authenticate('google',
                                { scope: 'https://www.googleapis.com/auth/userinfo.profile' }))
  app.get('/auth/google/callback',
          passport.authenticate('google', { failureRedirect: '/?google-callback-failure' }),
          function(req, res) {
            console.dir(req.user)
            res.redirect('/?google-callback-success');
          })

  // Auth0
  app.get('/auth/auth0',
          passport.authenticate('auth0'))
  app.get('/auth/auth0/callback',
          passport.authenticate('auth0', { failureRedirect: '/?auth0-callback-failure' }),
          function(req, res) {
            console.dir(req.user)
            res.redirect('/?auth0-callback-success');
          })
  
  // Vue SSR
  // https://forum.vuejs.org/t/accessing-current-request-context-through-vue-instance-for-server-side-rendering-to-be-able-to-access-cookies-for-initial-user-authentication/48/11
  app.get('*', (req, res) => {
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
  
  // WebSocket
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
    ws.on('message', (json) => {
      const message = JSON.parse(json)
      mongo[message.data.action](message.data.payload).then(
        r => { ws.send(JSON.stringify({ job_id: message.job_id, resolve: r })) },
        e => { ws.send(JSON.stringify({ job_id: message.job_id, reject: e })) }
      )
    })
  })
  
  // Start web server
  server.listen(8181, function listening() {
    console.log('Listening on %d', server.address().port);
  })

}).catch(err => {
  console.log(err.message)
})
