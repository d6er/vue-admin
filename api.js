const mongo = require('./mongo')
const actions = {}
let db

// todo: encrypt password

actions.create_account = function(payload) {
  
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

actions.update_account = function(payload) {
  
}

actions.delete_account = function(payload) {
  
}

actions.save_item = function(payload) {
  return mongo.connect().then(dbobj => {
    db = dbobj
    return mongo.getNextId('items')
  }).then(r => {
    const new_item = payload
    new_item._id = r.value.seq
    return db.collection('items').insertOne(new_item)
  })
}

actions.fetch_items = function(payload) {
  return mongo.connect().then(dbobj => {
    db = dbobj
    return db.collection('items').find({}).skip(0).limit(100).toArray()
  })
}

module.exports = actions
