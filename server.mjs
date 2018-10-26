import fs from 'fs'
import ws from 'ws'
import http from 'http'
import bodyParser from 'body-parser'

// Express
import express from 'express'
import session from 'express-session'

// Mongo
import config from './config/server'
import MongoClient from 'mongodb'

// Vue
import createBundleRenderer from 'vue-server-renderer'

(async () => {
  
  let db = await MongoClient.connect(config.mongo_url)
  
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
        renderer = createBundleRenderer.createBundleRenderer(bundle, Object.assign(options, {
          runInNewContext: false
        }))
      }
    )
    
    process.once('SIGUSR2', function () {
      process.kill(process.pid, 'SIGUSR2');
    });
  }
  
  // app.use
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use('/dist', express.static('dist'))
  app.get('/favicon.ico', (req, res) => { res.end() })
  
  app.get('*', (req, res) => {
    
    const context = {
      title: 'vue-admin',
      url: req.url
    }
    
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
            console.log('ERROR ' + req.url)
            console.dir(err)
          }
          res.end(html)
        })
      })
      
    }

  })
  
  const server = http.createServer(app)
  
  server.listen(config.server_port, () => {
    console.log('Listening on %d', server.address().port)
  })
  
})()
