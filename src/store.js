import Vue from 'vue'
import Vuex from 'vuex'
import ws from './websocket'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [
      { id: 1, title: 'item foo' },
      { id: 2, title: 'item bar' }
    ]
  },
  actions: {
    signup ({ commit }, data) {
      return new Promise((resolve, reject) => {
        ws.send('signup', data).then(response => {
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
