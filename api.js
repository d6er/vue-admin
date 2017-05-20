const mongo = require('./mongo')
const actions = {}

actions.create_account = function(payload) {
  // todo:
  // increment user_id
  // encrypt password
  mongo.connect().then(db => {
    console.log('connnn')
    return mongo.getNextId('users')
  }).then(r => {
    console.dir(r)
    const new_user = payload
    new_user._id = r.value.seq
    
    console.log('[NEW USER]')
    console.dir(new_user)
    
    return this.db.collection('users').insertOne(new_user)
  })
}

actions.update_account = function(payload) {
  
}

actions.delete_account = function(payload) {
  
}

module.exports = actions
