import config from '../config/server'
import mongo from '../server-src/mongo'
//import { createApp } from './app' // note: moved to inside Promise

export default context => {
  
  return new Promise((resolve, reject) => {
    
    return mongo.connect(config.mongo_url).then(db => {
      
      // note: import app.js after mongo connection
      //const { app, router, store } = createApp()
      const { app, router, store } = require('./app').createApp()
      
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
          context.state = store.state
          resolve(app)
        }).catch(reject)
      }, reject)
      
    })
    
  })
}
