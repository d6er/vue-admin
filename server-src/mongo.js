// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient
const moment = require('moment')

let db

const actions = {
  
  connect: function (url) {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
        console.log('mongo.connect() ' + url)
        return MongoClient.connect(url).then(dbobj => {
          db = dbobj
          resolve(db)
        })
      }
    })
  },
  
  getConnection: function () {
    return db
  },
  
  getNextId: function (name) {
    return db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { upsert: true, returnOriginal: false }
    )
  },

  createUser: function ({ username, password }) {
    
    return db.collection('users').findOne({ username: username }).then(r => {
      return new Promise((resolve, reject) => {
        if (r) {
          reject('username ' + username + ' already exists')
        } else {
          resolve()
        }
      })
    }).then(() => {
      return this.getNextId('users')
    }).then(r => {
      let user = {
        _id: r.value.seq,
        username: username,
        password: password // todo: encrypt password
      }
      return db.collection('users').insertOne(user)
    })
  },
  
  deleteUser: function ({ user_id }) {
    console.log('mongo.js deleteAccount user_id: ' + user_id)
  },
  
  getUser: function (user_id) {
    return db.collection('users').findOne({ _id: user_id })
  },
  
  addAccount: function (user_id, account) {
    let users = db.collection('users')
    users.update(
      {
        _id: user_id,
        accounts: {
          $elemMatch: {
            provider: account.provider,
            id: account.id
          }
        }
      },
      { $set: { 'accounts.$': account } },
      { safe: true }
    ).then(r => {
      console.dir(r.result)
      if (r.result.n == 0) {
        return users.update(
          { _id: user_id },
          { $addToSet: { 'accounts': account } },
          { safe: true }
        )
      }
    })
  },
  
  saveItem: function({ user_id, list, item }) {
    let coll = list + '.' + user_id
    if (item._id) {
      return db.collection(coll).updateOne({ _id: item._id },
                                           { $set: item},
                                           { upsert: true })
    } else {
      // new item
      return this.getNextId(coll).then(r => {
        item._id = r.value.seq
        return db.collection(coll).insertOne(item)
      })
    }
  },
  
  saveItems: function (user_id, list, items) {
    let coll = list + '.' + user_id
    console.log('saveItems: ' + coll + ' ' + items.length)
    return Promise.all(items.map(item => {
      return db.collection(coll).updateOne({ _id: item._id },
                                           { $set: item },
                                           { upsert: true })
    }))
  },
  
  fetchItem: function ({ user_id, list, filter, item_id }) {

    filter.sorting.push({ field: '_id', order: 'desc' })
    
    let coll = list + '.' + user_id
    let query = actions.convertQueries(filter.queries)
    let sort = actions.convertSorting(filter.sorting)
    let queriesForSort = []
    let result = {}
    
    return db.collection(coll).findOne({ _id: item_id }).then(item => {
      
      if (item.payload.mimeType == 'text/plain') {
        item.body = Buffer.from(item.payload.body.data, 'base64').toString()
      } else if (item.payload.mimeType == 'multipart/alternative') {
        item.body = Buffer.from(item.payload.parts[0].body.data, 'base64').toString()
      }
      result.item = item
      
      for (let i in filter.sorting) {
        
        let q = {}
        for (let j = 0; j < i; j++) {
          let f = filter.sorting[j].field
          q[f] = item[f]
        }
        
        let s = filter.sorting[i]
        if (s.order == 'asc') {
          q[s.field] = { $lt: item[s.field] }
        } else if (s.order == 'desc') {
          q[s.field] = { $gt: item[s.field] }
        }
        
        queriesForSort.push(q)
      }
      
      let positionQuery = { $and: [ query, { $or: queriesForSort } ] }
      
      return db.collection(coll).find(positionQuery).count()
      
    })
      .catch(reason => {
        console.log(reason)
      })
      .then(position => {
      
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
  
  fetchItems: function ({ user_id, list, filter, page }) {
    
    console.log(user_id + ' ' + list)
    console.dir(filter)
    console.log(page)
    
    const query = actions.convertQueries(filter.queries)
    const sort = actions.convertSorting(filter.sorting)
    
    const limit = 30
    const skip = page ? limit * ( page - 1 ) : 0
    
    const cursor = db.collection(list + '.' + user_id).find(query)
    
    return cursor.count().then(count => {
      
      console.log(count)
      
      const paging = {
        start: skip + 1,
        end: (skip + limit < count) ? (skip + limit) : count,
        count: count,
        hasPrev: (page > 1),
        hasNext: (skip + limit < count)
      }
      
      return cursor.sort(sort).skip(skip).limit(limit).toArray().then(items => {
        //items.forEach(actions.convertItem)
        return { items: items, paging: paging }
      })
    }).catch(e => {
      console.dir(e)
    })
  },
  
  copyItems: function ({ user_id, item_ids }) {
    
    console.dir(item_ids)
    const query = { _id: { $in: item_ids } }
    const coll = 'items.' + user_id

    return db.collection(coll).find(query).toArray().then(docs => {
      
      const copies = docs.map(doc => {
        return this.getNextId(coll).then(r => {
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
  
  deleteItems: function ({ user_id, item_ids }) {
    return db.collection('items.' + user_id).deleteMany({ _id: { $in: item_ids } })
  },
  
  convertItem: function (item) {
    item.updated = moment(item.updated).format('MMM D HH:mm')
  },
  
  escapeRegExp: function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
  },

  convertQueries: function (queries) {
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
  
  convertSorting: function (sorting) {
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
  },

  // for gmail
  getMaxHistoryId: function (user_id, list, account) {
    const coll = list + '.' + user_id
    return db.collection(coll).findOne({ account: account.emails[0].value },
                                       { fields: { 'historyId': 1 },
                                         sort: [[ 'historyId', 'descending' ]] })
  }
  
}

module.exports = actions
