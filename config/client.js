const items = require('./list/items.json')
const emails = require('./list/emails.json')

const config = {
  
  websocket_url: 'ws://localhost:8181',
  
  lists: [ emails, items ]
  
}

module.exports = config
