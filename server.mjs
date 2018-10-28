import fs from 'fs'
import ws from 'ws'
import http from 'http'
import bodyParser from 'body-parser'

// Express
import express from 'express'
import session from 'express-session'
import connectMongo from 'connect-mongo'
const MongoStore = connectMongo(session)

// Mongo
import config from './config/server'
import mongo from './server-src/mongo'

import wsPool from './server-src/websocket-pool'

// Vue
import createBundleRenderer from 'vue-server-renderer'

(async () => {
  
  let db = await mongo.connect(config.mongo_url)
  
  // Passport (need db connection)
  const passport = await import('./server-src/passport')
  const auth = await import('./server-src/auth')
  
  const app = express()
  
  let renderer
  let readyPromise
  const templatePath = './src/index.template.html'
  
  // Development
  if (process.env.NODE_ENV === 'development') {
    let setupDevServer = await import('./build/setup-dev-server')
    readyPromise = setupDevServer.setupDevServer(
      app,
      templatePath,
      (bundle, options) => {
        console.log('setupDevServer callback')
        renderer = createBundleRenderer.createBundleRenderer(bundle, Object.assign(options, {
          basedir: '/home/nabe/work/vue-admin/dist',
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
  app.use(passport.passport.initialize())
  app.use(passport.passport.session())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/dist', express.static('dist'))
  app.use('/images', express.static('images'))
  app.use('/auth', auth.router)

  app.get('/favicon.ico', (req, res) => { res.end() })
  
  app.get('*', (req, res, next) => {
    
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
          console.dir(err)
        }
        res.end(html)
      })
      
    } else if (process.env.NODE_ENV === 'development') {
      
      readyPromise.then(() => {
        renderer.renderToString(context, (err, html) => {
          if (err) {
            console.log('ERROR ' + req.url)
            console.log(err)
            next(err)
          } else {
            res.end(html)
          }
        })
      })
      
    }

  })
  
  const server = http.createServer(app)
  
  //const api = await import('./server-src/api')
  
  server.listen(config.server_port, () => {
    console.log('Listening on %d', server.address().port)
  })
  
})()
