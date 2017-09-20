const fs = require('fs')
const mongo = require('./mongo')
const google = require('./google')

const methods = {
  
  fetchItems: ({ user_id, list, filter, page }) => {
    return mongo.fetchItems({ user_id, list, filter, page })
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
