const MongoClient = require('mongodb').MongoClient
let db

module.exports = {
  
  connect: () => {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
        console.log('[MONGO] CONNECT')
        MongoClient.connect('mongodb://localhost:27017/vue-admin').then(dbobj => {
          db = dbobj
          resolve(db)
        })
      }
    })
  },
  
  getNextId: (name) => {
    return db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { upsert: true, returnOriginal: false }
    )
  }
  
}
