import api from '../../server-src/api/index.js'

export default {
  call (data) {
    return api[data.action](data)
  }
}
