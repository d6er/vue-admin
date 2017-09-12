const config = {
  
  tabs: [ 'detail', 'description', 'pictures' ],
  
  fields: [
    {
      name: 'title',
      type: 'text',
      linkToDetail: true
    },
    {
      name: 'subtitle',
      type: 'text'
    },
    {
      name: 'account',
      type: 'text'
    },
    {
      name: 'status',
      type: 'select',
      values: [ 'published', 'unpublished', 'draft', 'trash' ]
    },
    {
      name: 'updated',
      type: 'datetime'
    },
    {
      name: 'created',
      type: 'datetime'
    },
    {
      name: 'picture',
      type: 'image'
    }
  ],

  filters: [
    {
      name: 'all',
      parent: '',
      foreach: '',
      queries: [],
      sorting: [
        { field: 'updated', order: 'desc' },
        { field: 'title', order: 'asc' }
      ],
      columns: [ 'picture', 'title', 'account', 'status', 'updated' ]
    },
    {
      name: 'account',
      parent: '',
      foreach: 'account',
      queries: [],
      sorting: [
        { field: 'updated', order: 'desc' },
        { field: 'title', order: 'asc' }
      ],
      columns: [ 'picture', 'title', 'account', 'status', 'updated' ]
    },
    {
      name: 'status',
      parent: 'all',
      foreach: 'status',
      queries: []
    },
    {
      name: 'status',
      parent: 'account',
      foreach: 'status',
      queries: []
    }
  ]
  
}

export default config
