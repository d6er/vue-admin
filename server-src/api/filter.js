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
  }
  
}

module.exports = methods
