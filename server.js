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
const { createBundleRenderer } = require('vue-server-renderer')

mongo.connect(config.mongo_url).then(db => {
  
  // Passport (need db connection)
  const passport = require('./server-src/passport')
  const auth = require('./server-src/auth')
  
  const app = express()
  
  let renderer
  let readyPromise
  const templatePath = './src/index.template.html'
  
  
  // production
  if (process.env.NODE_ENV === 'production') {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createBundleRenderer(bundle, {
      template,
      clientManifest,
      runInNewContext: false
    })
  }  
  
  // Development
  if (process.env.NODE_ENV === 'development') {
    readyPromise = require('./build/setup-dev-server')(
      app,
      templatePath,
      (bundle, options) => {
        renderer = createBundleRenderer(bundle, Object.assign(options, {
          runInNewContext: false
        }))
      }
    )
    
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
      context.user = req.user
    } else {
      context.user = null
    }
    
    console.log('ENV ' + process.env.NODE_ENV)
    
    if (process.env.NODE_ENV === 'production') {
      
      renderer.renderToString(context, (err, html) => {
        if (err) {
          console.log('renderToString err')
          console.dir(err)
        }
        res.end(html)
      })
      
    } else if (process.env.NODE_ENV === 'development') {
      
      readyPromise.then(() => {
        renderer.renderToString(context, (err, html) => {
          if (err) {
            console.log('renderToString err')
            console.dir(err)
          }
          res.end(html)
        })
      })
      
    }
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
      
      console.log('ws: ' + message.data.action)
      
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
    
    // https://github.com/websockets/ws/issues/1256#issuecomment-352288884
    ws.on('error', error => {
      console.log('server.js ws.on error')
      console.dir(error)
    })
  })
  
  // Start web server
  server.listen(config.server_port, () => {
    console.log('Listening on %d', server.address().port);
  })
  
}).catch(err => {

  console.log('server.js catch err')
  console.dir(err)
  
})
