const user = require('./user')
const account = require('./account')
const item = require('./item')
const hackerNews = require('./hacker-news')

const methods = Object.assign({}, user, account, item)

module.exports = methods
