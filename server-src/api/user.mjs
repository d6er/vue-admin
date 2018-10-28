import filter from './filter'
import mongo from '../mongo'

const db = mongo.getConnection()

const methods = {
  
  createUser: function ({ username, password }) {
    
    return db.collection('users').findOne({ username: username }).then(r => {
      
      console.log('user.js check exist')
      return new Promise((resolve, reject) => {
        if (r) {
          reject('username ' + username + ' already exists')
        } else {
          resolve()
        }
      })
      
    }).then(() => {
      
      console.log('user.js getNextId')
      return mongo.getNextId('users')
      
    }).then(r => {
      
      console.log('user.js insert')
      let user = {
        _id: r.value.seq,
        username: username,
        password: password // todo: encrypt password
      }
      return db.collection('users').insertOne(user).then(r => {
        return user
      })
      
    }).then(user => {
      
      console.log('user.js copyDefaultFiltersAllLists')
      return filter.copyDefaultFiltersAllLists({ user_id: user._id })
      
    }).then(() => {
      
      console.log('user.js createUser last')
      return
      
    })
  },
  
  deleteUser: function ({ user_id }) {
    return db.collection('filters').deleteMany({ user_id: user_id }).then(r => {
      return db.collection('accounts').deleteMany({ user_id: user_id })
    }).then(r => {
      return db.collection('users').deleteOne({ _id: user_id })
    })
  },
  
  getUser: function (user_id) {
    // todo: check deleted flag
    return db.collection('users').findOne({ _id: user_id })
  }
}

export default methods
