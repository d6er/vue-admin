import config from '../../server-src/config'
import mongo from '../../server-src/mongo'

export default {
  call (data) {
    return mongo.connect(config.mongo_url).then(r => {
      return mongo[data.action](data) // return a Promise
    })
  }
}
