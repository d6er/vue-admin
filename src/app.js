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
    let path = '/' + store.state.lists[0].name + '/' + store.state.lists[0].filters[0].name
    next({ path: path })
  } else {
    next()
  }
}

let listsRegExp = store.state.lists.map(list => list.name).join('|')

// auth-flow: https://github.com/vuejs/vue-router/tree/dev/examples/auth-flow/components
const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      beforeEnter: checkAuth,
      components: {
        default: () => import('./views/Home.vue'),
        nav: () => import('./views/GuestNav.vue')
      }
    },
    {
      path: '/login',
      beforeEnter: checkAuth,
      components: {
        default: () => import('./views/Login.vue'),
        nav: () => import('./views/GuestNav.vue')
      }
    },
    {
      // todo: check logged out
      path: '/signup',
      beforeEnter: checkAuth,
      components: {
        default: () => import('./views/Signup.vue'),
        nav: () => import('./views/GuestNav.vue')
      }
    },
    {
      path: '/:list(' + listsRegExp + ')/:filter',
      beforeEnter: requireAuth,
      component: () => import('./views/Main.vue'),
      children: [
        {
          path: 'p:page(\\d+)?',
          alias: '', // alias for page 1
          component: () => import('./views/List.vue')
        },
        {
          path: ':id(\\d+)/:tab?',
          components: () => import('./views/Detail.vue')
        },
        {
          path: '/user',
          components: () => import('./views/User.vue')
        }
      ]
    },
    {
      path: '/:list(' + listsRegExp + ')',
      beforeEnter: requireAuth,
      redirect: to => {
        let list = store.state.lists.find(e => e.name == to.params.list)
        let path = to.fullPath + '/' + list.filters[0].name
        return path
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
