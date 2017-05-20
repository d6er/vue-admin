import { createApp } from './app'

const { app, router, store } = createApp()

// moved into app.js for testing
if (window.__INITIAL_STATE__) {
  //store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  app.$mount('#app')
})
