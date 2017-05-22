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
  return mongo.connect().then(dbobj => {
    db = dbobj
    return mongo.getNextId('items')
  }).then(r => {
    const new_item = payload
    new_item._id = r.value.seq
    return db.collection('items').insertOne(new_item)
  })
}

actions.fetchItems = function(payload) {
  return mongo.connect().then(dbobj => {
    db = dbobj
    return db.collection('items').find({}).skip(0).limit(100).toArray()
  })
}

module.exports = actions
