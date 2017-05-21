import Vue from 'vue'
import Vuex from 'vuex'
import ws from './websocket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isAuthenticated: false,
    items: [
      { id: 1, title: 'item foo' },
      { id: 2, title: 'item bar' },
      { id: 101, title: 'item title title' },
      { id: 110, title: 'item bird foo' },
      { id: 123, title: 'item foo boo' },
      { id: 234, title: 'item boost boost' }
    ]
  },
  actions: {
    create_account ({ commit }, data) {
      return new Promise((resolve, reject) => {
        ws.send('create_account', data).then(response => {
          // update state
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    }
  },
  strict: true,
  mutations: {
    login (state) {
      state.token = 'foo'
    },
    logout (state) {
      state.token = ''
    }
  }
})
