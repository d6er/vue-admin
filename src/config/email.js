const config = {
  
  tabs: [ 'detail', 'raw' ],

  fields: [
    {
      name: 'subject',
      type: 'text',
      linkToDetail: true
    },
    {
      name: 'to',
      type: 'text'
    },
    {
      name: 'from',
      type: 'text'
    },
    {
      name: 'date',
      type: 'datetime'
    }
  ],

  filters: [
    {
      name: 'all',
      parent: '',
      foreach: '',
      queries: [],
      sorting: [ { field: 'date', order: 'desc' } ],
      columns: [ 'from', 'subject', 'date' ]
    },
    {
      name: 'inbox',
      parent: 'all',
      queries: [ { field: 'labelIds',
                   condition: 'is equal to',
                   value: 'INBOX' } ]
    },
    {
      name: 'unread',
      parent: 'all',
      queries: [ { field: 'labelIds',
                   condition: 'is equal to',
                   value: 'UNREAD' } ]
    }
  ]  
  
}

export default config
