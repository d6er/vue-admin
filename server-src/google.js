const google = require('googleapis')
const gmail = google.gmail('v1')

const methods = {
  
  messagesList: function (account) {
    
    // https://github.com/google/google-api-nodejs-client/#authorizing-and-authenticating
    let clientId = '1088034821843-fmeepsu3a7jqmqbcqej74qlu0em9viv4.apps.googleusercontent.com'
    let clientSecret = 'alDLTJpR550tFMFtS85-2wqQ'
    let redirectUrl = "http://localhost:8181/auth/google/callback"
    
    var OAuth2 = google.auth.OAuth2
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
    oauth2Client.setCredentials({ access_token: account.accessToken });
    
    return new Promise((resolve, reject) => {
      
      let params = {
        auth: oauth2Client,
        userId: 'me',
        maxResults: 3
      }
      
      gmail.users.messages.list(params, function(err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response.messages)
        }
      })
      
    }).then(messages => {
      
      let getMessages = messages.map(message => {
        return new Promise((resolve, reject) => {
          console.log('get: ' + message.id)
          
          let params = {
            auth: oauth2Client,
            userId: 'me',
            id: message.id
          }
          
          gmail.users.messages.get(params, function(err, response) {
            if (err) {
              reject(err)
            } else {
              console.log('got: ' + message.id)
              resolve(response)
            }
          })
        })
      })
      
      return Promise.all(getMessages)
    })
  }
  
}

module.exports = methods
