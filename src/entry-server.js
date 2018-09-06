import config from '../config/server'
import mongo from '../server-src/mongo'
//import { createApp } from './app' // note: moved to inside Promise

export default context => {
  
  return new Promise((resolve, reject) => {
    
    return mongo.connect(config.mongo_url).then(db => {
      
      // note: import app.js after mongo connection
      //const { app, router, store } = createApp()
      const { app, router, store } = require('./app').createApp()
      
      // fetch filter data and set to store (for redirect from / path)
      let query = {
        user_id: context.user._id,
      }
      // todo: exclude user_id from result
      db.collection('filters').find(query).toArray().then(filters => {
        store.state.lists.forEach(list => {
          console.log(list.name)
          list.filters = filters.filter(f => f.list == list.name)
        })
      }).then(() => {
        
        console.log('entry-server')
        store.state.user = context.user
        
        router.push(context.url)
        
        router.onReady(() => {
          
          const matchedComponents = router.getMatchedComponents()
          if (!matchedComponents.length) {
            reject({ code: 404 })
          }
          
          Promise.all(matchedComponents.map(Component => {
            if (Component.asyncData) {
              return Component.asyncData({ store, route: router.currentRoute })
            }
          })).then(() => {
            console.log('resolve app')
            context.state = store.state
            resolve(app)
          }).catch(reject)
        }, reject)
        
      })
      
    })
    
  })
}
