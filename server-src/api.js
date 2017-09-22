const fs = require('fs')
const moment = require('moment-timezone')
const mongo = require('./mongo')
const google = require('./google')
const config_client = require('../config/client')

const methods = {
  
  fetchItems: ({ user_id, list, filter, page }) => {
    
    let zone = moment.tz.guess()
    
    return mongo.fetchItems({ user_id, list, filter, page }).then(result => {
      
      let listConfig = config_client.lists.find(l => l.name == list)
      
      filter.columns.map(column => {
        let fieldConfig = listConfig.fields.find(field => field.name == column)
        if (fieldConfig.type == 'datetime') {
          result.items.forEach(item => {
            item[column] = moment(item[column]).tz(zone).format('MMM D HH:mm')
          })
        }
      })
      
      return result
    })
  },
  
  refreshList: ({ user_id, list, filter, page }) => {
    
    return mongo.getUser(user_id).then(user => {
      
      return user.accounts.filter(account => account.provider == 'google')
      
    }).then(googleAccounts => {
      
      return Promise.all(googleAccounts.map(account => {
        return google.messagesList(account).then(messages => {
          return mongo.saveItems(user_id, list, messages)
        })
      }))
      
    }).then(savedResults => {
      return mongo.fetchItems({ user_id: user_id,
                                list: list,
                                filter: filter,
                                page: page })
    })
  },
  
  uploadImage: ({ name, file }) => {
    const buffer = Buffer.from(file, 'base64');
    return new Promise((resolve, reject) => {
      fs.writeFile('./images/' + name, buffer, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve({ path: '/images/' + name })
        }
      })
    })
  }
  
}

module.exports = methods
