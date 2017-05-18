const actions = {
  db: null // will be set in server.js
}

actions.signup = function(payload) {
  
  let user = payload
  
  this.db.collection('users').insert(user)
  
}

module.exports = actions
