import MongoClient from 'mongodb'

import config from './config/server'

(async () => {
  
  let db = await MongoClient.connect(config.mongo_url)
  
  console.dir(db)
  
})()
