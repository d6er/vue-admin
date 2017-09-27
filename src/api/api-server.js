import config from '../../config/server'
import mongo from '../../server-src/mongo'
import api from '../../server-src/api'

export default {
  call (data) {
    return mongo.connect(config.mongo_url).then(r => {
      if (api[data.action]) {
        return api[data.action](data)
      } else {
        return mongo[data.action](data)
      }
    })
  }
}
