import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import store from './store'

Vue.use(Router)

// https://medium.com/@bradfmd/vue-js-setting-up-auth0-6eb26cbbc48a
function requireAuth(to, from, next) {
  if (!store.state.user) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    console.dir('=> ' + to.fullPath)
    next()
  }
}

// auth-flow: https://github.com/vuejs/vue-router/tree/dev/examples/auth-flow/components
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/list',
      component: () => import('./components/List.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/detail',
      component: () => import('./components/Detail.vue'),
      beforeEnter: requireAuth
    },
    {
      path: '/login',
      component: () => import('./components/Login.vue'),
    },
    {
      path: '/signup',
      component: () => import('./components/Signup.vue'),
    }
  ]
})

export function createApp () {
  
  // moved from entry-client.js for testing
  if (typeof window !== 'undefined') {
    if (window.__INITIAL_STATE__) {
      store.replaceState(window.__INITIAL_STATE__)
    }
  }
  
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
