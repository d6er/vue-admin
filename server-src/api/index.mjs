import user from './user.mjs'
import account from  './account'
import item from './item.mjs'
import filter from './filter.mjs'

const methods = Object.assign({}, user, account, item, filter)

export default methods
