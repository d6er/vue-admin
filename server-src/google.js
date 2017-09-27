const config = require('../config/server')
const moment = require('moment')
const google = require('googleapis')
const gmail = google.gmail('v1')

const methods = {
  
  messagesList: function (account) {
    
    console.log('google.messagesList: ' + account.emails[0].value)
    
    // https://github.com/google/google-api-nodejs-client/#authorizing-and-authenticating
    let clientId = config.GOOGLE_CLIENT_ID
    let clientSecret = config.GOOGLE_CLIENT_SECRET
    let redirectUrl = "http://localhost:8181/auth/google/callback"
    
    var OAuth2 = google.auth.OAuth2
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl)
    
    // https://github.com/google/google-api-nodejs-client/#manually-refreshing-access-token
    oauth2Client.setCredentials({
      access_token: account.accessToken,
      refresh_token: account.refreshToken,
      expiry_date: true
    });
    
    return new Promise((resolve, reject) => {
      
      let params = {
        auth: oauth2Client,
        userId: 'me'
      }
      
      gmail.users.messages.list(params, function(err, response) {
        if (err) {
          console.dir(err)
          reject(err)
        } else {
          resolve(response.messages)
        }
      })
      
    }).then(messages => {
      
      let getMessages = messages.map((message, idx) => {
        return new Promise((resolve, reject) => {
          
          let params = {
            auth: oauth2Client,
            userId: 'me',
            id: message.id
          }
          
          setTimeout(() => {
            gmail.users.messages.get(params, function(err, response) {
              if (err) {
                console.log(idx + ' ' + message.id)
                console.dir(err)
                reject(err)
              } else {
                console.log(idx + ' ' + message.id)
                let converted = methods.convertMessage(response)
                resolve(response)
              }
            })
          }, idx * 1000)
        })
      })
      
      return Promise.all(getMessages)
    })
    
  },

  convertMessage: function (message) {
    
    let headers = message.payload.headers
    message._id = message.id
    message.subject = headers.find(header => header.name == 'Subject').value
    message.from = headers.find(header => header.name == 'From').value.replace(/<[^>]+>/, '')
    message.to = headers.find(header => header.name == 'To').value
    
    let date = headers.find(header => header.name == 'Date').value
    message.date = moment(date, "ddd, DD MMM YYYY HH:mm:ss ZZ").toDate()
    
    return message
  }
  
}

module.exports = methods
