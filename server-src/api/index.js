const user = require('./user')
const account = require('./account')

const methods = Object.assign({}, user, account);

module.exports = methods
