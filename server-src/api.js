const mongo = require('./mongo')
const google = require('./google')

const methods = {
  
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
  }
  
}

module.exports = methods
