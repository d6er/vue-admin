import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
//import App from '../src-uikit/App.vue'
import store from './store'
import { sync } from 'vuex-router-sync'

Vue.use(Router)

// https://medium.com/@bradfmd/vue-js-setting-up-auth0-6eb26cbbc48a
function requireAuth(to, from, next) {
  if (store.state.user) {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
}

// auth-flow: https://github.com/vuejs/vue-router/tree/dev/examples/auth-flow/components
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      components: {
        default: () => import('./components/Home.vue'),
        nav: () => import('./components/GuestNav.vue')
      }
    },
    {
      path: '/login',
      components: {
        default: () => import('./components/Login.vue'),
        nav: () => import('./components/GuestNav.vue')
      }
    },
    {
      // todo: check logged out
      path: '/signup',
      components: {
        default: () => import('./components/Signup.vue'),
        nav: () => import('./components/GuestNav.vue')
      }
    },
    {
      path: '/items/:status?',
      beforeEnter: requireAuth,
      components: {
        default: () => import('./components/List.vue'),
        nav: () => import('./components/Nav.vue'),
        menu: () => import('./components/SideMenu.vue')
      }
    },
    {
      path: '/item/:id',
      beforeEnter: requireAuth,
      components: {
        default: () => import('./components/Detail.vue'),
        nav: () => import('./components/Nav.vue'),
        menu: () => import('./components/SideMenu.vue')
      }
    },
    {
      path: '/user',
      beforeEnter: requireAuth,
      components: {
        default: () => import('./components/User.vue'),
        nav: () => import('./components/Nav.vue'),
        menu: () => import('./components/SideMenu.vue')
      }
    },
    {
      path: '/settings/items/fields',
      beforeEnter: requireAuth,
      components: {
        default: () => import('./components/Fields.vue'),
        nav: () => import('./components/Nav.vue'),
        menu: () => import('./components/SideMenu.vue')
      }
    },
  ]
})

export function createApp () {
  
  sync(store, router)
  
  // moved from entry-client.js for testing
  if (typeof window !== 'undefined') {
    if (window.__INITIAL_STATE__) {
      store.replaceState(window.__INITIAL_STATE__)
      
      // https://github.com/vuejs/vue/issues/4501#issuecomment-269089269
      //router.history.updateRoute(router.resolve(store.state.route.fullPath).resolved)
    }
  }
  
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
