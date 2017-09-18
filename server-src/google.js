const moment = require('moment')
const google = require('googleapis')
const gmail = google.gmail('v1')

const methods = {
  
  messagesList: function (account) {
    
    console.log('google.messagesList: ' + account.emails[0].value)
    
    // https://github.com/google/google-api-nodejs-client/#authorizing-and-authenticating
    let clientId = '1088034821843-fmeepsu3a7jqmqbcqej74qlu0em9viv4.apps.googleusercontent.com'
    let clientSecret = 'alDLTJpR550tFMFtS85-2wqQ'
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
        console.dir(response)
        if (err) {
          reject(err)
        } else {
          resolve(response.messages)
        }
      })
      
    }).then(messages => {
      
      let getMessages = messages.map(message => {
        return new Promise((resolve, reject) => {
          
          let params = {
            auth: oauth2Client,
            userId: 'me',
            id: message.id
          }
          
          gmail.users.messages.get(params, function(err, response) {
            if (err) {
              reject(err)
            } else {
              let converted = methods.convertMessage(response)
              resolve(response)
            }
          })
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
    date = date.replace(', -', ' -')
    message.date = moment(date)._d
    
    return message
  }
  
}

module.exports = methods
