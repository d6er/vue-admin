import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter (store) {
  
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
      next(path)
    } else {
      next()
    }
  }
  
  let listsRegExp = store.state.lists.map(list => list.name).join('|')

  // auth-flow: https://github.com/vuejs/vue-router/tree/dev/examples/auth-flow/components
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        beforeEnter: checkAuth,
        component: () => import('./views/Home.vue')
      },
      {
        path: '/login',
        beforeEnter: checkAuth,
        component: () => import('./views/Login.vue')
      },
      {
        path: '/signup',
        beforeEnter: checkAuth,
        component: () => import('./views/Signup.vue')
      },
      {
        path: '/settings',
        beforeEnter: requireAuth,
        component: () => import('./views/Settings.vue')
      },
      {
        path: '/:list(' + listsRegExp + ')/:filter',
        beforeEnter: requireAuth,
        component: () => import('./views/Container.vue'),
        children: [
          {
            path: 'p:page(\\d+)?',
            alias: '', // alias for page 1
            beforeEnter: requireAuth,
            component: () => import('./views/List.vue')
          },
          {
            path: ':id(\\d+)/:tab?',
            beforeEnter: requireAuth,
            components: () => import('./views/Detail.vue')
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
}
