const config = {
  
  tabs: [ 'detail' ],

  fields: [
    {
      name: 'subject',
      type: 'text',
      value: message => {
        message.payload.headers.find(header => header.name == 'Subject').value
      }
    }
  ],

  filters: [
    {
      name: 'all-emails',
      parent: '',
      foreach: '',
      queries: [],
      sorting: [],
      columns: [ 'subject' ]
    }
  ]  
  
}

export default config
