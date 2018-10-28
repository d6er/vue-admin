import api from '../../server-src/api/index.mjs'

export default {
  call (data) {
    return api[data.action](data)
  }
}
