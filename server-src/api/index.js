const user = require('./user')
const account = require('./account')
const item = require('./item')

const methods = Object.assign({}, user, account, item)

module.exports = methods
