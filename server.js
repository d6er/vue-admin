const api = require('./api')
const db_connect = require('./db')
const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const http = require('http')
const url = require('url')
const ws = require('ws')
const session = require('express-session')
const MongoClient = require('mongodb').MongoClient
const MongoStore = require('connect-mongo')(session)
const passport = require('./passport')
const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync('./src/index.template.html', 'utf-8')

//MongoClient.connect('mongodb://localhost:27017/vue-admin').then(function(db) {
db_connect.then(db => {
  
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
    saveUninitialized: true,
    secret: '$eCuRiTy',
    store: new MongoStore({ db: db }),
    resave: true
  })
  
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(sessionParser)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use('/dist', express.static('dist'))

  app.post('/login', passport.authenticate('local', { successRedirect: '/?ok',
                                                      failureRedirect: '/login?ng',
                                                      failureFlash: false }))

  // http://stackoverflow.com/questions/33112299/how-to-delete-cookie-on-logout-in-express-passport-js
  app.get('/logout', (req, res) => {
    //req.logout()
    res.clearCookie('connect.sid')
    req.session.destroy(function (err) {
      res.redirect('/')
    })
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
  
  app.get('*', (req, res) => {

    if (req.url == '/favicon.ico') {
      res.end()
      return
    }
    
    console.log('URL: ' + req.url)
    
    const context = {
      title: 'vue-admin',
      url: req.url
    }
    
    // https://forum.vuejs.org/t/accessing-current-request-context-through-vue-instance-for-server-side-rendering-to-be-able-to-access-cookies-for-initial-user-authentication/48/11
    
    if (req.cookies['connect.sid']) {
      context.sid = req.cookies['connect.sid']
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
