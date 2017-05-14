import { createApp } from './app'

export default context => {
  
  const { app, router, store } = createApp()
  
  if (context.token) {
    store.state.token = context.token
  }
  
  router.push(context.url)
  
  context.state = store.state
  
  return app
}
