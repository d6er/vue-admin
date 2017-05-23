import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: {}
  },
  actions: {
    
    create_account ({ commit }, data) {
      return new Promise((resolve, reject) => {
        api.call('createAccount', data).then(response => {
          // update state
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    
    saveItem ({ commit }, data) {
      return new Promise((resolve, reject) => {
        api.call('saveItem', data).then(response => {
          // update state
          resolve(response)
        }, error => {
          reject(error)
        })
      })
    },
    
    fetchItems ({ commit }, data) {
      return api.call('fetchItems', data).then(items => {
        commit('setItems', items)
      })
    }
  },
  strict: true,
  mutations: {
    // todo: use constant for function names. https://vuex.vuejs.org/en/mutations.html
    setItems (state, items) {
      items.forEach(item => {
        Vue.set(state.items, item._id, item)
      })
    }
  }
})
