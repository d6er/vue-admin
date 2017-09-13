import item from './item'
import email from './email'

const config = {
  
  websocket_url: 'ws://localhost:8181',
  
  lists: [
    {
      name: 'items',
      tabs: item.tabs,
      fields: item.fields,
      filters: item.filters
    },
    {
      name: 'emails',
      tabs: email.tabs,
      fields: email.fields,
      filters: email.filters
    },
    {
      name: 'messages',
      tabs: [],
      filters: [ { name: 'messages-all' } ]
    }
  ]
  
}

export default config
