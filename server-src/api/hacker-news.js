const axios = require('axios')

const mongo = require('../mongo')
const db = mongo.getConnection()

const methods = {
  
  syncTopStories: (user_id) => {
    
    let url = 'https://hacker-news.firebaseio.com/v0/topstories.json'
    
    return axios.get(url).then(r => {
      return Promise.all(
        r.data.map((id, idx) => {
          let url = 'https://hacker-news.firebaseio.com/v0/item/' + id + '.json'
          return axios.get(url).then(res => {
            let item = res.data
            item._id = item.id
            item.idx = idx
            return db.collection('hacker-news.' + user_id).updateOne({ _id: item._id },
                                                                     { $set: item},
                                                                     { upsert: true })
          })
        })
      )
    })
  }
  
}

module.exports = methods
