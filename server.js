const fs = require('fs')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const http = require('http')
const url = require('url')
const WebSocket = require('ws')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('./passport')
const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync('./src/index.template.html', 'utf-8')

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
  resave: true
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sessionParser)
/*
app.use(session({
  secret: 'foo',
  store: new MongoStore({})
}))
*/
app.use(passport.initialize())
app.use(passport.session())
app.use('/dist', express.static('dist'))

app.post('/login', passport.authenticate('local', { successRedirect: '/?ok',
                                                    failureRedirect: '/login?ng',
                                                    failureFlash: false }))

app.get('/auth/google',
        passport.authenticate('google',
                              { scope: 'https://www.googleapis.com/auth/userinfo.profile' }))

app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/?google-callback-failure' }),
        function(req, res) {
          console.dir(req.user)
          res.redirect('/?google-callback-success');
        })

app.get('*', (req, res) => {

  if (req.url == '/favicon.ico') {
    res.end()
    return
  }
  
  console.log('URL: ' + req.url)
  
  const context = {
    title: 'Vue-SUI-Dashboard',
    url: req.url
  }

  if (req.url == '/logout') {
    res.clearCookie('token');
    res.redirect('/')
    return
  }
  
  // https://forum.vuejs.org/t/accessing-current-request-context-through-vue-instance-for-server-side-rendering-to-be-able-to-access-cookies-for-initial-user-authentication/48/11
  
  // "/callback?code=****" request
  if (req.query.code) {
    
    var postdata = {
      client_id: 'FJJtRAN2B45f6SigcjeyiNF_0TX-Qjav',
      redirect_uri: 'http://localhost:8181/callback',
      client_secret: 'f8Fw4LAuZBGLJ344ROLJJQHFNEbXU7tdjS02HKZIQfEiDUcsGtVRB9rW2zCIP5_7',
      code: req.query.code,
      grant_type: 'authorization_code'
    }
    
    var axios = require('axios')
    axios.post('https://d6er.auth0.com/oauth/token', postdata)
      .then(function (response) {
        
        axios.get('https://d6er.auth0.com/userinfo/?access_token=' + response.data.access_token)
          .then(function(response) {
            
            context.token = response.data.name
            res.cookie('token', response.data.name)
            res.redirect('/list')

          }).catch(function (error) {
            console.dir(error);
          });
        
      }).catch(function (error) {
        console.dir(error);
      })
    
    return
  }
  
  console.log('cookies:')
  console.dir(req.cookies)
  
  console.log('req.user:')
  console.dir(req.user)
  
  if (req.cookies.token) {
    context.token = req.cookies.token
  }
  
  promise.then(() => {
    renderer.renderToString(context, (err, html) => {
      res.end(html)
    })
  })
})

const server = http.createServer(app);

const wss = new WebSocket.Server({
  verifyClient: (info, done) => {
    sessionParser(info.req, {}, () => {
      console.dir('WebSocket info.req.session')
      console.dir(info.req.session)
      
      // We can reject the connection by returning false to done().
      done(true)
    });
  },
  server
})
 
wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const session = ws.upgradeReq.session

    // Here we can now use session parameters.
    console.log(`WS message ${message} from user ${session.userId}`)
  })
})
 
server.listen(8181, function listening() {
  console.log('Listening on %d', server.address().port);
})
