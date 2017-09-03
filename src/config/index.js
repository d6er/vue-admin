import item from './item'

const config = {
  
  websocket_url: 'ws://localhost:8181',
  
  lists: [
    {
      name: 'items',
      fields: item.fields,
      filters: item.filters
    },
    {
      name: 'orders',
      filters: [ { name: 'orders-all' } ]
    },
    {
      name: 'messages',
      filters: [ { name: 'messages-all' } ]
    }
  ]
  
}

export default config
