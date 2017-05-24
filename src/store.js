import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: {}
  },
  // https://vuex.vuejs.org/en/strict.html
  strict: process.env.NODE_ENV !== 'production',
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
    
    update_account ({ commit }, data) {
    },
    
    delete_account ({ commit }, data) {
    },
    
    saveItem ({ commit }, data) {
      return api.call('saveItem', data)
    },
    
    fetchItems ({ commit }, data) {
      return api.call('fetchItems', data).then(items => {
        commit('setItems', items)
      })
    },
    
    deleteItem({ commit }, data) {
    }
    
  },
  mutations: {
    // todo: use constant for function names. https://vuex.vuejs.org/en/mutations.html
    setItems (state, items) {
      items.forEach(item => {
        Vue.set(state.items, item._id, item)
      })
    }
  }
})
