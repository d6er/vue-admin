'use strict'

const fs = require('fs')
const ws = require('ws')
const url = require('url')
const http = require('http')
const bodyParser = require('body-parser')

// Express
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// Mongo
const config = require('./server-src/config')
const mongo = require('./server-src/mongo')

// Passport
const passport = require('./server-src/passport')
const auth = require('./server-src/auth')

const google = require('./server-src/google')

// Vue
const template = fs.readFileSync('./src/index.template.html', 'utf-8')
const { createBundleRenderer } = require('vue-server-renderer')

mongo.connect(config.mongo_url).then(db => {
  
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
    ws.on('message', json => {
      
      const message = JSON.parse(json)
      
      if (message.data.action != 'createUser') {
        if (!req.session.passport.hasOwnProperty('user')) {
          console.log('not auth')
          ws.send(JSON.stringify({ job_id: message.job_id, reject: 'auth error' }))
          return
        }
      }
      
      if (message.data.action == 'uploadImage') {
        console.dir(message)
        const buffer = Buffer.from(message.data.file, 'base64');
        fs.writeFileSync('./images/' + message.data.name, buffer)
        ws.send(JSON.stringify({ job_id: message.job_id,
                                 resolve: { path: '/images/' + message.data.name } }))
        return
      }
      
      if (message.data.action == 'refreshList') {
        console.log('refreshList')
        return mongo.getUser(req.session.passport.user).then(user => {
          return google.messagesList(user.accounts[0])
        }).then(messages => {
          console.log('refreshList: ' + messages.length)
          return mongo.saveItems(req.session.passport.user, 'emails', messages)
        }).then(
          r => { ws.send(JSON.stringify({ job_id: message.job_id, resolve: r })) },
          e => { ws.send(JSON.stringify({ job_id: message.job_id, reject: e })) }
        )
      }
      
      mongo[message.data.action](message.data).then(
        r => { ws.send(JSON.stringify({ job_id: message.job_id, resolve: r })) },
        e => { ws.send(JSON.stringify({ job_id: message.job_id, reject: e })) }
      )
    })
  })
  
  // Start web server
  server.listen(config.server_port, function listening() {
    console.log('Listening on %d', server.address().port);
  })
  
}).catch(err => {
  
  console.log(err.message)
  
})
