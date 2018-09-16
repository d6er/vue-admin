const config_list = require('../../config/list')

const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  saveFilter: ({ user_id, list, filter }) => {
    
    filter.user_id = user_id
    filter.list = list
    
    let coll = 'filters'
    if (filter._id) {
      
      // update existing filter
      return db.collection(coll).updateOne(
        { _id: filter._id },
        { $set: filter},
        { upsert: true }
      ).then(r => {
        return methods.fetchFilters({ user_id: user_id, list: list })
      })
      
    } else {
      // create a new filter
      return mongo.getNextId(coll).then(r => {
        filter._id = r.value.seq
        return db.collection(coll).insertOne(filter)
      }).then(r => {
        return methods.fetchFilters({ user_id: user_id, list: list })
      })
    }
  },
  
  deleteFilter: ({ user_id, list, filter }) => {
    console.log('item.js deleteFilter')
    return db.collection('filters').deleteOne(
      {
        user_id: user_id,
        list: list,
        _id: filter._id
      }
    ).then(r => {
      return methods.fetchFilters({ user_id: user_id, list: list })
    })
  },
  
  fetchFilters: ({ user_id, list }) => {
    let query = {
      user_id: user_id,
      list: list
    }
    return db.collection('filters').find(query).toArray()
  },
  
  copyDefaultFilters: ({ user_id }) => {
    
    console.log('copyDefaultFilters ' + user_id);
    
    let filters = []
    config_list.forEach(list => {
      list.defaultFilters.forEach(filter => {
        filter.list = list.name
        filter.user_id = user_id
        filters.push(filter)
      })
    })
    
    return db.collection('filters').insertMany(filters)
  }
  
}

module.exports = methods
