import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
//import App from '../src-uikit/App.vue'
import store from './store'
import { sync } from 'vuex-router-sync'

Vue.use(Router)

// https://medium.com/@bradfmd/vue-js-setting-up-auth0-6eb26cbbc48a
function requireAuth (to, from, next) {
  if (store.state.user) {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
}

function checkAuth (to, from, next) {
  if (store.state.user) {
    next({ path: '/items/all' })
  } else {
    next()
  }
}

// auth-flow: https://github.com/vuejs/vue-router/tree/dev/examples/auth-flow/components
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      beforeEnter: checkAuth,
      components: {
        default: () => import('./components/Home.vue'),
        nav: () => import('./components/GuestNav.vue')
      }
    },
    {
      path: '/login',
      beforeEnter: checkAuth,
      components: {
        default: () => import('./components/Login.vue'),
        nav: () => import('./components/GuestNav.vue')
      }
    },
    {
      // todo: check logged out
      path: '/signup',
      beforeEnter: checkAuth,
      components: {
        default: () => import('./components/Signup.vue'),
        nav: () => import('./components/GuestNav.vue')
      }
    },
    {
      path: '/test/:filter+',
      beforeEnter: requireAuth,
      components: {
        default: () => import('./components/Test.vue'),
        nav: () => import('./components/Nav.vue'),
        menu: () => import('./components/SideMenu.vue')
      }
    },
    {
      /*
        /items/account.hal9000dev/status.active/
       */
      path: '/items/:status?/:page?',
      beforeEnter: requireAuth,
      components: {
        default: () => import('./components/Items.vue'),
        nav: () => import('./components/Nav.vue'),
        menu: () => import('./components/SideMenu.vue')
      }
    },
    {
      path: '/item/:id/:tab',
      beforeEnter: requireAuth,
      components: {
        default: () => import('./components/Item.vue'),
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
    }
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
