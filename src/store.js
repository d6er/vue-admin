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
    
    createAccount ({ commit }, data) {
      return api.call({ action: 'createAccount', payload: data })
    },
    
    deleteAccount ({ commit }) {
      return api.call({ action: 'deleteAccount' })
    },
    
    saveItem ({ commit }, data) {
      return api.call({ action: 'saveItem', payload: data })
    },
    
    fetchItems ({ commit }, data) {
      return api.call({ action: 'fetchItems', payload: data }).then(items => {
        commit('setItems', items)
      })
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
