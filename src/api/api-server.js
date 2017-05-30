import config from '../../config'
import mongo from '../../src-server/mongo'

export default {
  call (data) {
    return mongo.connect(config.mongo_url).then(r => {
      return mongo[data.action](data) // return a Promise
    })
  }
}
