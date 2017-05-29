// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient
const moment = require('moment')

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
      console.dir(r)
      if (r) {
        reject('username ' + payload.username + ' already exists')
      }
    }).then(() => {
      return this.getNextId('users')
    }).then(r => {
      payload._id = r.value.seq
      return db.collection('users').insertOne(payload)
    })
  },
  
  deleteAccount: function(payload, user_id) {
    console.log('mongo.js deleteAccount')
  },
  
  saveItem: function(payload, user_id) {
    
    const coll = 'items.' + user_id
    
    payload.updated = new Date()
    
    if (payload._id) {
      // existing item
      return db.collection(coll).updateOne({ _id: payload._id }, payload)
    } else {
      // new item
      return this.getNextId(coll).then(r => {
        payload._id = r.value.seq
        return db.collection(coll).insertOne(payload)
      })
    }
  },
  
  fetchItems: function (payload, user_id) {
    return db.collection('items.' + user_id).find(payload).skip(0).limit(100).toArray()
      .then(docs => {
        docs.forEach(actions.convertItem)
        return docs
      })
  },
  
  convertItem: function(item) {
    item.updated = moment(item.updated).format('MMM D HH:mm:ss')
  }
}

module.exports = actions
