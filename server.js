'use strict'

const fs = require('fs')
const ws = require('ws')
const http = require('http')
const bodyParser = require('body-parser')

// Express
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// Mongo
const config = require('./config/server')
const mongo = require('./server-src/mongo')

const wsPool = require('./server-src/websocket-pool')

// Vue
const template = fs.readFileSync('./src/index.template.html', 'utf-8')
const { createBundleRenderer } = require('vue-server-renderer')

mongo.connect(config.mongo_url).then(db => {
  
  // Passport (need db connection)
  const passport = require('./server-src/passport')
  const auth = require('./server-src/auth')
  
  const app = express()
  
  let serverBundle, clientManifest, renderer
  let promise
  
  // production
  if (process.env.NODE_ENV === 'production') {
    serverBundle = require('./dist/vue-ssr-server-bundle.json')
    clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false,
      template,
      clientManifest
    })
  }  
  
  // Development
  if (process.env.NODE_ENV === 'development') {
    promise = require('./build/setup-dev-server')(app, (serverBundle, clientManifest) => {
      renderer = createBundleRenderer(serverBundle, {
        runInNewContext: false,
        template,
        clientManifest
      })
    })
    
    process.once('SIGUSR2', function () {
      process.kill(process.pid, 'SIGUSR2');
    });
  }
  
  const sessionParser = session({
    store: new MongoStore({ db: db }),
    secret: '$eCuRiTy',
    resave: true,
    saveUninitialized: true
  })
  
  // app.use
  app.use(sessionParser)
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/dist', express.static('dist'))
  app.use('/images', express.static('images'))
  app.use('/auth', auth)
  
  app.get('/favicon.ico', (req, res) => { res.end() })
  
  // Vue SSR
  // https://forum.vuejs.org/t/accessing-current-request-context-through-vue-instance-for-server-side-rendering-to-be-able-to-access-cookies-for-initial-user-authentication/48/11
  
  app.get('*', (req, res) => {
    
    const context = {
      title: 'vue-admin',
      url: req.url
    }
    
    if (req.isAuthenticated()) {
      console.log('server.js')
      context.user = req.user
    } else {
      context.user = null
    }
    
    promise.then(() => {
      renderer.renderToString(context, (err, html) => {
        if (err) {
          console.dir(err)
        }
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
  
  const api = require('./server-src/api/index.js')
  
  wss.on('connection', (ws, req) => {
    
    if (req.session.passport && req.session.passport.hasOwnProperty('user')) {
      wsPool.add(req.sessionID, req.session.passport.user, ws)
    }
    
    ws.on('message', json => {
      
      const message = JSON.parse(json)
      
      if (message.data.action != 'createUser') {
        if (!req.session.passport.hasOwnProperty('user')) {
          console.log('not auth')
          ws.send(JSON.stringify({ job_id: message.job_id, reject: 'auth error' }))
          return
        }
      }
      
      api[message.data.action](message.data).then(
        r => { ws.send(JSON.stringify({ job_id: message.job_id, resolve: r })) },
        e => { ws.send(JSON.stringify({ job_id: message.job_id, reject: e })) }
      )
    })
  })
  
  // Start web server
  server.listen(config.server_port, function () {
    console.log('Listening on %d', server.address().port);
  })
  
}).catch(err => {
  console.dir(err)
})
