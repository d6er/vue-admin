const mongo = require('./mongo')
const axios = require('axios')

const actions = {
  
  importNews: function () {
    
    let url = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty'
    
    return axios.get(url).then(response => {
      return response.data
    })
  }
  
}

module.exports = actions
