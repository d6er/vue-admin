const config = {
  
  tabs: [ 'detail' ],

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
      type: 'text',
      value: val => val.replace(/<[^>]+>/, '')
    },
    {
      name: 'date',
      type: 'datetime'
    }
  ],

  filters: [
    {
      name: 'inbox',
      parent: '',
      foreach: '',
      queries: [],
      sorting: [ { field: 'date', order: 'desc' } ],
      columns: [ 'from', 'subject', 'date' ]
    }
  ]  
  
}

export default config
