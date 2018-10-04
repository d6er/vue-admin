const config_list = require('../../config/list')

const apiItem = require('./item')

const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  saveFilter: ({ user_id, listName, filter }) => {
    
    filter.user_id = user_id
    filter.list = listName
    
    let coll = 'filters'
    if (filter._id) {
      
      // update existing filter
      return db.collection(coll).updateOne(
        { _id: filter._id },
        { $set: filter },
        { upsert: true }
      ).then(r => {
        return methods.buildFilterTree({ user_id: user_id, listName: listName }).then(r => {
          return methods.fetchFilters({ user_id: user_id, listName: listName })
        })
      })
      
    } else {
      
      // create a new filter
      return mongo.getNextId(coll).then(r => {
        filter._id = r.value.seq
        return db.collection(coll).insertOne(filter)
      }).then(r => {
        return methods.fetchFilters({ user_id: user_id, listName: listName })
      })
      
    }
  },
  
  deleteFilters: ({ user_id, listName }) => {
    return db.collection('filters').deleteMany({
      user_id: user_id,
      list: listName
    }).then(r => {
      return
    })
  },
  
  deleteFilter: ({ user_id, listName, filter }) => {
    return db.collection('filters').deleteOne({
      user_id: user_id,
      list: listName,
      _id: filter._id
    }).then(r => {
      return methods.fetchFilters({ user_id: user_id, listName: listName })
    })
  },
  
  fetchFilters: ({ user_id, listName }) => {
    let query = {
      user_id: user_id,
      list: listName
    }
    return db.collection('filters').find(query).toArray()
  },
  
  copyDefaultFiltersAllLists: ({ user_id }) => {
    return Promise.all(config_list.map(list => {
      return methods.copyDefaultFilters({ user_id: user_id, listName: list.name })
    }))
  },
  
  copyDefaultFilters: ({ user_id, listName }) => {
    
    let list = config_list.find(list => list.name == listName)
    let coll = 'filters'
    
    let copies = list.defaultFilters.map(filter => {
      return mongo.getNextId(coll).then(r => {
        return Object.assign({
          _id: r.value.seq,
          user_id: user_id,
          list: listName
        }, filter)
      })
    })
    
    return Promise.all(copies).then(copied_filters => {
      console.log('[COPIED FILTERS] ' + listName)
      return db.collection(coll).insertMany(copied_filters)
    }).then(r => {
      return methods.fetchFilters({ user_id: user_id, listName: listName })
    })
  },
  
  buildFilterTree: ({ user_id, listName }) => {
    methods.fetchFilters({ user_id: user_id, listName: listName }).then(filters => {
      return Promise.all(filters.map(methods.countFilteredItems))
    }).then(r => {
      console.dir(r, { depth: null })
      return
    })
  },
  
  countFilteredItems: filter => {
    let query = apiItem.convertQueries(filter.queries)
    let coll = db.collection(filter.list + '.' + filter.user_id)
    
    if (filter.drilldowns) {
      
      let agg_id = {}
      filter.drilldowns.map(field => {
        agg_id[field] = '$' + field
      })
      console.dir(agg_id)
      
      return coll.aggregate([
        { $match: query },
        {
          $group: {
            _id: agg_id,
            count: { $sum: 1 }
          }
        }
      ]).toArray()
      
    } else {
      
      return coll.find(query).count().then(count => {
        return {
          name: filter.name,
          count: count
        }
      })
      
    }
  },
  
  restoreDefaultFilters: ({ user_id, listName }) => {
    let param = {
      user_id: user_id,
      listName: listName
    }
    return methods.deleteFilters(param).then(r => {
      return methods.copyDefaultFilters(param)
    }).then(r => {
      return methods.fetchFilters(param)
    })
  }
  
}

module.exports = methods
