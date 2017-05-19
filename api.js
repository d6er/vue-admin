const actions = {
  db: null // will be set in server.js
}

actions.create_account = function(payload) {
  const user = payload
  // todo:
  // increment user_id
  // encrypt password
  return this.db.collection('users').insertOne(user) // returns promise
}

actions.update_account = function(payload) {
  
}

actions.delete_account = function(payload) {
  
}

module.exports = actions
