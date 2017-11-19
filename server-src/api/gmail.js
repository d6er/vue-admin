const moment = require('moment')
const google = require('googleapis')
const gmail = google.gmail('v1')

const config = require('../../config/server')
const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  getOAuth2Client: account => {
    
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
  messagesList: oauth2Client => {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      maxResults: 5
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
  
  messagesGet: (oauth2Client, id) => {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      id: id
    }
    return new Promise((resolve, reject) => {
      gmail.users.messages.get(params, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  },
  
  // https://developers.google.com/gmail/api/v1/reference/users/history/list
  historyList: (oauth2Client, historyId) => {
    let params = {
      auth: oauth2Client,
      userId: 'me',
      startHistoryId: historyId
    }
    return new Promise((resolve, reject) => {
      gmail.users.history.list(params, (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      })
    })
  },
  
  getMaxHistoryId: (user_id, list, account) => {
    const coll = list + '.' + user_id
    return db.collection(coll).findOne({ account: account.emails[0].value },
                                       { fields: { 'historyId': 1 },
                                         sort: [ [ 'historyId', 'descending' ] ] })
  },
  
  convertMessage: message => {
    
    let headers = message.payload.headers
    message._id = message.id
    message.subject = headers.find(header => header.name == 'Subject').value
    message.from = headers.find(header => header.name == 'From').value.replace(/<[^>]+>/, '')
    message.to = headers.find(header => header.name == 'To').value
    
    let date = headers.find(header => header.name == 'Date').value
    message.date = moment(date, "ddd, DD MMM YYYY HH:mm:ss ZZ").toDate()
    
    message.historyId = parseInt(message.historyId)
    
    return message
  },
  
  syncItems: (user_id, account) => {
    
    let oauth2Client = methods.getOAuth2Client(account)
    
    return methods.getMaxHistoryId(user_id, 'emails', account).then(r => {
      return methods.historyList(oauth2Client, r.historyId)
    }).then(r => {
      
      console.log(account.emails[0].value)
      if (!r.hasOwnProperty('history')) {
        return
      }
      
      let coll = db.collection('emails.' + user_id)
      
      return Promise.all(r.history.map(h => {
        
        console.dir(h, { depth: null })
        
        if (h.hasOwnProperty('messagesAdded')) {
          
          return Promise.all(h.messagesAdded.map(m => {
            return methods.messagesGet(oauth2Client, m.message.id).then(responseMessage => {
              
              let converted = methods.convertMessage(responseMessage)
              converted.account = account.emails[0].value
              
              return coll.updateOne({ _id: converted._id },
                                    { $set: converted },
                                    { upsert: true })
            })
          }))
          
        } else if (h.hasOwnProperty('messagesDeleted')) {
          
          return Promise.all(h.messagesDeleted.map(m => {
            return coll.deleteOne({ _id: m.message.id })
          }))
          
        } else if (h.hasOwnProperty('labelsAdded')) {
          
          return Promise.all(h.labelsAdded.map(m => {
            return coll.updateOne({ _id: m.message.id },
                                  { $set: { labelIds: m.message.labelIds } })
          }))
          
        } else if (h.hasOwnProperty('labelsRemoved')) {
          
          return Promise.all(h.labelsRemoved.map(m => {
            return coll.updateOne({ _id: m.message.id },
                                  { $set: { labelIds: m.message.labelIds } })
          }))
          
        }
        
      }))
      
    })
    
  }
  
}

module.exports = methods
