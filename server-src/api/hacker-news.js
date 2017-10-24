const axios = require('axios')

const methods = {
  
  topStories: () => {
    let url = 'https://hacker-news.firebaseio.com/v0/topstories.json'
    axios.get(url).then(r => {
      console.dir(r)
    })
  },
  
  item: (id) => {
    let url = 'https://hacker-news.firebaseio.com/v0/item' + id
    axios.get(url).then(r => {
      console.dir(r)
    })
  }
}

module.exports = methods
