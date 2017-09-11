const config = {
  
  tabs: [ 'detail' ],

  fields: [
    {
      name: 'subject',
      type: 'text'
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
