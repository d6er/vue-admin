import auth0js from 'auth0-js'

const auth0 = new auth0js.WebAuth({
  clientID: 'FJJtRAN2B45f6SigcjeyiNF_0TX-Qjav',
  domain: 'd6er.auth0.com',
  //responseMode: 'query' // http://auth0.github.io/auth0.js/docs/Authentication.html
})

export default auth0