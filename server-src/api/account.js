const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  addAccount: function (user_id, account) {
    
    let users = db.collection('users')
    
    users.update(
      {
        _id: user_id,
        accounts: {
          $elemMatch: {
            provider: account.provider,
            id: account.id
          }
        }
      },
      { $set: { 'accounts.$': account } },
      { safe: true }
    ).then(r => {
      console.dir(r.result)
      if (r.result.n == 0) {
        return users.update(
          { _id: user_id },
          { $addToSet: { 'accounts': account } },
          { safe: true }
        )
      }
    })
    
  },
  
  removeAccount: function (user_id, account) {
    
  }
  
}

module.exports = methods
