import { createApp } from './app'

export default context => {
  
  return new Promise((resolve, reject) => {
    
    const { app, router, store } = createApp()
    
    store.state.isAuthenticated = context.isAuthenticated
    
    if (context.user) {
      store.state.user = context.user
    } else {
      delete store.state.user
    }
    
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
}
