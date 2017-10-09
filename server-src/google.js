const config = require('../config/server')
const moment = require('moment')
const google = require('googleapis')
const gmail = google.gmail('v1')

const methods = {
  
  getOAuth2Client: function (account) {
    
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
    
    return oauth2Client
  },
  
  // https://developers.google.com/gmail/api/v1/reference/users/messages/list
  messagesList: function (oauth2Client) {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      maxResults: 500
    }
    return new Promise((resolve, reject) => {
      gmail.users.messages.list(params, function(err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  },
  
  messagesGet: function (oauth2Client, id) {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      id: id
    }
    return new Promise((resolve, reject) => {
      gmail.users.messages.get(params, function(err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  },
  
  // https://developers.google.com/gmail/api/v1/reference/users/history/list
  historyList: function (oauth2Client, historyId) {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      startHistoryId: historyId
    }
    return new Promise((resolve, reject) => {
      gmail.users.history.list(params, function(err, response) {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
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
    
    message.historyId = parseInt(message.historyId)
    
    return message
  }
  
}

module.exports = methods
