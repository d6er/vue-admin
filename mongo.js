const MongoClient = require('mongodb').MongoClient
let db_singleton

module.exports = {
  
  connect: () => {
    return new Promise((resolve, reject) => {
      if (db_singleton) {
        console.log('[MONGO] REUSE')
        resolve(db_singleton)
        return
      }
      console.log('[MONGO] CONNECT')
      MongoClient.connect('mongodb://localhost:27017/vue-admin').then(function(db) {
        db_singleton = db
        resolve(db_singleton)
      })
    })
  },
  
  getNextId: (name) => {
    return db_singleton.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { upsert: true }
    )
  }
  
}
