import item from './item'
import email from './email'

const config = {
  
  websocket_url: 'ws://localhost:8181',
  
  lists: [
    {
      name: 'items',
      fields: item.fields,
      filters: item.filters
    },
    {
      name: 'emails',
      fields: email.fields,
      filters: email.filters
    },
    {
      name: 'messages',
      filters: [ { name: 'messages-all' } ]
    }
  ]
  
}

export default config
