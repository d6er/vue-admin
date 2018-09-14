const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  createUser: function ({ username, password }) {
    
    return db.collection('users').findOne({ username: username }).then(r => {
      
      return new Promise((resolve, reject) => {
        if (r) {
          reject('username ' + username + ' already exists')
        } else {
          resolve()
        }
      })
      
    }).then(() => {
      
      return mongo.getNextId('users')
      
    }).then(r => {
      
      let user = {
        _id: r.value.seq,
        username: username,
        password: password // todo: encrypt password
      }
      return db.collection('users').insertOne(user).then(r => {
        return { insertedId: user._id }
      })
      
    })
  },
  
  deleteUser: function ({ user_id }) {
    return db.collection('filters').deleteMany(
      { user_id: user_id }
    ).then(r => {
      return db.collection('users').deleteOne(
        { _id: user_id }
      )
    })
  },
  
  getUser: function (user_id) {
    // todo: check deleted flag
    return db.collection('users').findOne({ _id: user_id })
  }
}

module.exports = methods
