import { createApp } from './app'

export default context => {
  
  const { app, router, store } = createApp()
  
  store.state.isAuthenticated = context.isAuthenticated
  
  if (context.user) {
    store.state.user = context.user
  }
  
  router.push(context.url)
  
  context.state = store.state
  
  return app
}
