const moment = require('moment-timezone')
const mongo = require('../mongo')
const db = mongo.getConnection()
const config_client = require('../../config/client')

const methods = {
  
  fetchItem: ({ user_id, list, filter, item_id }) => {

    let mergedFilter = methods.getMergedFilter(list, filter, null)
    mergedFilter.sorting.push({ field: '_id', order: 'desc' })
    
    let query = methods.convertQueries(mergedFilter.queries)
    let sort = methods.convertSorting(mergedFilter.sorting)
    let queriesForSort = []
    let result = {}
    let coll = list + '.' + user_id
    
    return db.collection(coll).findOne({ _id: item_id }).then(item => {
      
      if (item.payload.mimeType == 'text/plain') {
        item.body = Buffer.from(item.payload.body.data, 'base64').toString()
      } else if (item.payload.mimeType == 'multipart/alternative') {
        item.body = Buffer.from(item.payload.parts[0].body.data, 'base64').toString()
      }
      result.item = item
      
      for (let i in mergedFilter.sorting) {
        
        let q = {}
        for (let j = 0; j < i; j++) {
          let f = mergedFilter.sorting[j].field
          q[f] = item[f]
        }
        
        let s = mergedFilter.sorting[i]
        if (s.order == 'asc') {
          q[s.field] = { $lt: item[s.field] }
        } else if (s.order == 'desc') {
          q[s.field] = { $gt: item[s.field] }
        }
        
        queriesForSort.push(q)
      }
      
      let positionQuery = { $and: [ query, { $or: queriesForSort } ] }
      
      return db.collection(coll).find(positionQuery).count()
      
    }).then(position => {
      
      result.paging = { position: position + 1 }
      
      let cursor = db.collection(coll).find(query, { _id: true })
      
      return cursor.count().then(count => {
        result.paging.count = count
        
        let skip = position ? position - 1 : 0
        let limit = position ? 3 : 2
        return cursor.sort(sort).skip(skip).limit(limit).toArray()
      })
      
    }).then(items => {
      
      let idx = items.findIndex(item => item._id == item_id)
      if (items[idx - 1]) {
        result.paging.prevId = items[idx - 1]._id
      }
      if (items[idx + 1]) {
        result.paging.nextId = items[idx + 1]._id
      }
      
      return result
    })
  },
  
  fetchItems: ({ user_id, list, filter, filterForm, page }) => {
    
    let mergedFilter = methods.getMergedFilter(list, filter, filterForm)
    let query = methods.convertQueries(mergedFilter.queries)
    let sort = methods.convertSorting(mergedFilter.sorting)
    let limit = 30
    let skip = page ? limit * ( page - 1 ) : 0
    let coll = list + '.' + user_id
    let zone = moment.tz.guess()
    
    const cursor = db.collection(coll).find(query)
    
    return cursor.count().then(count => {
      
      const paging = {
        start: skip + 1,
        end: (skip + limit < count) ? (skip + limit) : count,
        count: count,
        hasPrev: (page > 1),
        hasNext: (skip + limit < count)
      }
      
      return cursor.sort(sort).skip(skip).limit(limit).toArray().then(items => {
        
        let listConfig = config_client.lists.find(l => l.name == list)
        
        mergedFilter.columns.map(column => {
          let fieldConfig = listConfig.fields.find(field => field.name == column)
          if (fieldConfig.type == 'datetime') {
            items.forEach(item => {
              item[column] = moment(item[column]).tz(zone).format('MMM D HH:mm')
            })
          }
        })
        
        return {
          items: items,
          paging: paging,
          mergedFilter: mergedFilter
        }
      })
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
  },
  
  escapeRegExp: str => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
  },

  convertQueries: queries => {
    let converted = {}
    for (var i in queries) {
      var q = queries[i]
      if (!q.field) continue
      
      // todo: AND for multiple queries
      if (q.condition == 'is equal to') {
        converted[q.field] = q.value
      } else if (q.condition == 'is not equal to') {
        converted[q.field] = { $ne: q.value }
      } else if (q.condition == 'is less than') {
        converted[q.field] = { $lt: q.value }
      } else if (q.condition == 'is less than or equal') {
        converted[q.field] = { $lte: q.value }
      } else if (q.condition == 'is greater than') {
        converted[q.field] = { $gt: q.value }
      } else if (q.condition == 'is greater than or equal') {
        converted[q.field] = { $gte: q.value }
      } else if (q.condition == 'contains') {
        converted[q.field] = new RegExp(actions.escapeRegExp(q.value), 'i')
      } else if (q.condition == 'does not contain') {
        converted[q.field] = { $ne: new RegExp(actions.escapeRegExp(q.value), 'i') }
      }
    }
    return converted
  },
  
  convertSorting: sorting => {
    let converted = []
    
    for (var i in sorting) {
      var s = sorting[i]
      if (!s.field) continue
      
      if (s.order == 'asc') {
        converted.push([ s.field, 1 ])
      } else if (s.order == 'desc') {
        converted.push([ s.field, -1 ])
      }
    }
    converted.push([ '_id', -1 ])
    
    return converted
  }

}

module.exports = methods
