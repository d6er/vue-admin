const MongoClient = require('mongodb').MongoClient
let db_singleton

module.exports = new Promise((resolve, reject) => {
  
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

