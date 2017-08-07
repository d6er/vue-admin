// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient
const moment = require('moment')

let db

const actions = {
  
  connect: function (url, options, callback) {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
        console.log('[MONGO] CONNECT')
        return MongoClient.connect(url, options, callback).then(dbobj => {
          db = dbobj
          resolve(db)
        })
      }
    })
  },
  
  getNextId: function (name) {
    return db.collection('counters').findOneAndUpdate(
      { _id: name },
      { $inc: { seq: 1 } },
      { upsert: true, returnOriginal: false }
    )
  },

  createAccount: function ({ username, password }) {
    
    // todo: encrypt password
    const user = {
      username: username,
      password: password
    }
    
    return db.collection('users').findOne({ username: username }).then(r => {
      console.dir(r)
      if (r) {
        reject('username ' + username + ' already exists')
      }
    }).then(() => {
      return this.getNextId('users')
    }).then(r => {
      payload._id = r.value.seq
      return db.collection('users').insertOne(user)
    })
  },
  
  deleteAccount: function ({ user_id }) {
    console.log('mongo.js deleteAccount user_id: ' + user_id)
  },
  
  saveItem: function({ user_id, item }) {
    
    item.updated = new Date()
    
    const coll = 'items.' + user_id
    
    if (item._id) {
      // existing item
      return db.collection(coll).updateOne({ _id: item._id }, item)
    } else {
      // new item
      return this.getNextId(coll).then(r => {
        item._id = r.value.seq
        return db.collection(coll).insertOne(item)
      })
    }
  },
  
  fetchItem: function ({ user_id, item_id }) {
    return db.collection('items.' + user_id).findOne({ _id: item_id })
  },
  
  fetchItems: function ({ user_id, queries, sorting, columns, page }) {
    
    console.dir(queries)
    console.dir(sorting)
    console.dir(columns)
    
    const query = actions.convertQuery(queries)
    
    const sort = {}
    //filter.query.title = new RegExp(actions.escapeRegExp(filter.query.title), 'i')
    const cursor = db.collection('items.' + user_id).find(query)
    
    const limit = 10
    const skip = page ? limit * ( page - 1 ) : 0
    
    return cursor.count().then(count => {
      
      const paging = {
        start: skip + 1,
        end: (skip + limit < count) ? (skip + limit) : count,
        count: count,
        hasPrev: (page > 1),
        hasNext: (skip + limit < count)
      }
      
      return cursor.sort(sort).skip(skip).limit(limit).toArray().then(docs => {
        docs.forEach(actions.convertItem)
        return { items: docs, paging: paging }
      })
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

  convertQuery: function(queries) {
    let converted = {}
    for (var i in queries) {
      var q = queries[i]
      if (q.condition == 'is equal to') {
        converted[q.field] = q.value
      }
    }
    return converted
  }
}

module.exports = actions
