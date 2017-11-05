const user = require('./user')
const account = require('./account')
const item = require('./item')
const hackerNews = require('./hacker-news')

const methods = Object.assign({}, user, account, item)

methods.initialize = () => {
  console.log('server api initialize')
  return new Promise((resolve, reject) => {
    resolve({ text: 'foo' })
    resolve({ text: 'bar' })
  })
}

module.exports = methods
