const moment = require('moment-timezone')

const config_client = require('../../config/client')
const apiUser = require('./user')
const apiAccount = require('./account')
const gmail = require('./gmail')
const hackerNews = require('./hacker-news')
const wsPool = require('../websocket-pool')

const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  // todo: change method name to syncItems
  refreshList: ({ user_id, list, filter, page }) => {
    
    wsPool.send(user_id, 'Refreshing...')
    
    if (list == 'hacker-news') {
      return hackerNews.syncTopStories(user_id)
    }
    
    return apiAccount.fetchAccounts(user_id).then(accounts => {
      
      return accounts.filter(account => account.provider == 'google')
      
    }).then(googleAccounts => {
      
      return Promise.all(googleAccounts.map(account => {
        return gmail.syncItems(user_id, account)
      }))
      
    }).then(savedResults => {
      wsPool.send(user_id, 'Refreshed.')
      return methods.fetchItems({ user_id: user_id,
                                  list: list,
                                  filter: filter,
                                  page: page })
    }).catch(e => {
      console.dir(e)
      return
    })
  },
  
  fetchItem: ({ user_id, list, filter, item_id }) => {
    
    return db.collection('filters').findOne({
      user_id: user_id,
      list: list,
      name: filter
    }).then(filterObj => {
      
      filterObj.sorting.push({ field: '_id', order: 'desc' })
      
      let query = methods.convertQueries(filterObj.queries)
      let sort = methods.convertSorting(filterObj.sorting)
      
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
        
        for (let i in filterObj.sorting) {
          
          let q = {}
          for (let j = 0; j < i; j++) {
            let f = filterObj.sorting[j].field
            q[f] = item[f]
          }
          
          let s = filterObj.sorting[i]
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
      
    })
    
  },
  
  fetchItems: ({ user_id, list, filter, filterForm, page }) => {
    
    let limit = 30
    let skip = page ? limit * ( page - 1 ) : 0
    
    return db.collection('filters').findOne({
      user_id: user_id,
      list: list,
      name: filter
    }).then(filterObj => {
      
      if (filterForm) {
        filterObj = filterForm
      }
      
      let query = filterObj ? methods.convertQueries(filterObj.queries) : {}
      let sort = filterObj ? methods.convertSorting(filterObj.sorting) : {}
      let cursor = db.collection(list + '.' + user_id).find(query)
      
      return cursor.sort(sort).skip(skip).limit(limit).toArray().then(items => {
        return cursor.count().then(count => {
          
          const paging = {
            start: skip + 1,
            end: (skip + limit < count) ? (skip + limit) : count,
            count: count,
            hasPrev: (page > 1),
            hasNext: (skip + limit < count)
          }
          
          return {
            items: items,
            paging: paging
          }
        }).catch(e => {
          console.log('fetchItems2')
          console.dir(e)
        })
      }).catch(e => {
        console.log('fetchItems1')
        console.dir(e)
      })
    }).catch(e => {
      console.log('fetchItems0')
      console.dir(e)
    })
    
  },
  
  saveItem: ({ user_id, list, item }) => {
    let coll = list + '.' + user_id
    if (item._id) {
      return db.collection(coll).updateOne({ _id: item._id },
                                           { $set: item},
                                           { upsert: true })
    } else {
      // new item
      return mongo.getNextId(coll).then(r => {
        item._id = r.value.seq
        return db.collection(coll).insertOne(item)
      })
    }
  },

  copyItems: ({ user_id, item_ids }) => {
    
    console.dir(item_ids)
    const query = { _id: { $in: item_ids } }
    const coll = 'items.' + user_id

    return db.collection(coll).find(query).toArray().then(docs => {
      
      const copies = docs.map(doc => {
        return mongo.getNextId(coll).then(r => {
          const copied = Object.assign({}, doc)
          copied._id = r.value.seq
          return copied
        })
      })
      
      return Promise.all(copies).then(copied_items => {
        console.dir(copied_items)
        return db.collection(coll).insertMany(copied_items)
      })
    })
  },
  
  deleteItems: ({ user_id, item_ids }) => {
    return db.collection('items.' + user_id).deleteMany({ _id: { $in: item_ids } })
  },
  
  uploadImage: ({ name, file }) => {
    const buffer = Buffer.from(file, 'base64');
    return new Promise((resolve, reject) => {
      fs.writeFile('./images/' + name, buffer, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve({ path: '/images/' + name })
        }
      })
    })
  },
  
  escapeRegExp: str => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
  },

  convertQueries: queries => {
    let converted = {}
    for (var i in queries) {
      var q = queries[i]
      if (!q.field) continue
      if (!q.value) continue
      
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
        converted[q.field] = new RegExp(methods.escapeRegExp(q.value), 'i')
      } else if (q.condition == 'does not contain') {
        converted[q.field] = { $ne: new RegExp(methods.escapeRegExp(q.value), 'i') }
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
