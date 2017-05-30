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
    
    callApi ({ commit, state }, data) {
      data.user_id = state.user._id
      console.log('store callApi()')
      console.dir(data)
      return api.call(data).then(result => {
        if (data.action == 'fetchItems') {
          commit('setItems', result)
        }
        if (data.action == 'fetchItem') {
          commit('setItem', result)
        }
      })
    }
    
  },
  
  mutations: {
    // todo: use constant for function names. https://vuex.vuejs.org/en/mutations.html
    setItems (state, items) {
      items.forEach(item => {
        Vue.set(state.items, item._id, item)
      })
    },
    setItem (state, item) {
      Vue.set(state.items, item._id, item)
    }
  }
})
