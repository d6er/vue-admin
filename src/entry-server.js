import { createApp } from './app'

export default context => {
  
  const { app, router, store } = createApp()
  
  if (context.sid) {
    store.state.sid = context.sid
  }
  
  router.push(context.url)
  
  context.state = store.state
  
  return app
}
