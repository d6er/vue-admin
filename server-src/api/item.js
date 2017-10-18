const moment = require('moment-timezone')
const mongo = require('../mongo')
const config_client = require('../config/client')

const methods = {
  
  fetchItems: ({ user_id, list, filter, filterForm, page }) => {
    
    let mergedFilter = methods.getMergedFilter(list, filter, filterForm)
    
    let zone = moment.tz.guess()
    
    return mongo.fetchItems({ user_id, list, filter: mergedFilter, page }).then(result => {
      
      let listConfig = config_client.lists.find(l => l.name == list)
      
      mergedFilter.columns.map(column => {
        let fieldConfig = listConfig.fields.find(field => field.name == column)
        if (fieldConfig.type == 'datetime') {
          result.items.forEach(item => {
            item[column] = moment(item[column]).tz(zone).format('MMM D HH:mm')
          })
        }
      })
      
      result.mergedFilter = mergedFilter
      
      return result
    })
  },
  
  getMergedFilter: (listName, urlFilter, filterForm) => {
    
    let filter = { queries: [], sorting: [], columns: [] }
    let definedFilters = config_client.lists.find(e => e.name == listName).filters
    let path = urlFilter.split(',')
    
    for (let i in path) {
      let arr = path[i].split(/:/)
      
      let thisFilter = {}
      if (filterForm && i == (path.length - 1)) {
        thisFilter = filterForm
      } else {
        let refFilter = definedFilters.find(filter => filter.name == arr[0])
        thisFilter = JSON.parse(JSON.stringify(refFilter)) // deep copy
      }
      
      // queries
      if (arr.length == 2) {
        filter.queries.push({
          field: thisFilter.foreach,
          condition: 'is equal to',
          value: arr[1]
        })
      }
      if (thisFilter.queries) {
        filter.queries.push.apply(filter.queries, thisFilter.queries)
      }
      
      // sorting
      if (thisFilter.sorting) {
        filter.sorting = thisFilter.sorting
      }
      
      // columns
      if (thisFilter.columns) {
        filter.columns = thisFilter.columns
      }
    }
    
    return filter
  }
  
}

module.exports = methods
