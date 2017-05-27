// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient

let db

const actions = {
  
  connect: function (url, options, callback) {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
        console.log('[MONGO] CONNECT')
        return MongoClient.connect(url, options, callback).then(dbobj => {
          db = dbobj
          resolve(db)
        })
      }
    })
  },
  
  getNextId: function (name) {
    return db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { upsert: true, returnOriginal: false }
    )
  },

  createAccount: function (payload) {
    
    return db.collection('users').findOne({ username: payload.username }).then(r => {
      if (r) {
        reject('username ' + payload.username + ' already exists')
      }
    }).then(() => {
      return this.getNextId('users')
    }).then(r => {
      const new_user = payload
      new_user._id = r.value.seq
      console.dir(new_user)
    })
    
  },
  
  fetchItems: function (payload) {
    console.log('mongo.js fetchItems')
    return db.collection('items').find(payload).skip(0).limit(100).toArray()
  }

}

module.exports = actions
