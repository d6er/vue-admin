const mongo = require('./mongo')
const actions = {}
let db

// todo: encrypt password

actions.call = function(callname, payload) {
  return actions[callname](payload)
}

actions.createAccount = function(payload) {
  
  // https://developers.google.com/web/fundamentals/getting-started/primers/promises
  return mongo.connect().then(dbobj => {
    
    db = dbobj
    
    return new Promise((resolve, reject) => {
      db.collection('users').findOne({ username: payload.username }).then(r => {
        if (r) {
          reject('already exists')
        } else {
          resolve('not exists')
        }
      })
    })
    
  }).then(() => {
    
    return mongo.getNextId('users')
    
  }).then(r => {
    
    console.dir(r)
    
    const new_user = payload
    new_user._id = r.value.seq
    
    return db.collection('users').insertOne(new_user)
  })
}

actions.updateAccount = function(payload) {
  
}

actions.deleteAccount = function(payload) {
  
}

actions.saveItem = function(payload) {
  return mongo.connect().then(db => {
    
    payload.updated = new Date()
    
    if (payload._id) {
      // existing item
      db.collection('items').updateOne({ _id: payload._id }, payload)
    } else {
      // new item
      return mongo.getNextId('items').then(r => {
        payload._id = r.value.seq
        db.collection('items').insertOne(payload)
      })
    }
  })
}

actions.fetchItems = function(payload) {
  console.dir(payload)
  return mongo.connect().then(db => {
    return db.collection('items').find(payload).skip(0).limit(100).toArray()
  })
}

module.exports = actions
