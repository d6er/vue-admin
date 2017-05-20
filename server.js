const api = require('./api')
const mongo = require('./mongo')

const fs = require('fs')
const ws = require('ws')
const url = require('url')
const http = require('http')

const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')

const MongoStore = require('connect-mongo')(session)
const ObjectID = require('mongodb').ObjectID;

const passport = require('./passport')

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
    promise = require('./setup-dev-server')(app, (serverBundle, clientManifest) => {
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
  
  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/?u=' + req.user.username)
  })
  
  // http://stackoverflow.com/questions/33112299/how-to-delete-cookie-on-logout-in-express-passport-js
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/?logged-out')
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
    
    console.log('=========================')
    console.log('URL: ' + req.url)
    console.log('AUTH[' + req.isAuthenticated() + ']')
    
    const context = {
      title: 'vue-admin',
      url: req.url
    }
    
    
    if (req.user) {
      context.user = req.user
    }
    
    promise.then(() => {
      renderer.renderToString(context, (err, html) => {
        res.end(html)
      })
    })
  })

  const server = http.createServer(app);

  const wss = new ws.Server({
    verifyClient: (info, done) => {
      sessionParser(info.req, {}, () => {
        if (info.req.session.passport) {
          done(true)
        } else {
          done(false)
        }
      })
    },
    server
  })
  
  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      
      const session = ws.upgradeReq.session
      const data = JSON.parse(message)
      
      console.log('ws from: ' + session.passport.user)
      console.dir(data)
      
      if (!api[data.action]) {
        return
      }
      
      api[data.action](data.payload).then(
        function(r) {
          ws.send(JSON.stringify({
            jobid: data.jobid,
            resolve: { result: r.result }
          }))
        },
        function(r) {
          ws.send(JSON.stringify({
            jobid: data.jobid,
            reject: { message: r.message }
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
