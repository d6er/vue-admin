import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    user: null,
    items: {},
    notification: null
  },
  
  // https://vuex.vuejs.org/en/strict.html
  strict: process.env.NODE_ENV !== 'production',
  
  actions: {
    
    createAccount ({ commit }, data) {
      return api.call({ action: 'createAccount', payload: data })
    },
    
    callApi ({ commit, state }, data) {
      data.user_id = state.user._id
      return api.call(data).then(result => {
        // todo: map action and commit
        // https://github.com/vuejs/vuex/issues/755
        if (data.action == 'fetchItems') {
          commit('setItems', result)
        }
        if (data.action == 'fetchItem') {
          commit('setItem', result)
        }
        if (data.action == 'saveItem') {
          commit('setNotification', 'Item was saved.')
        }
        if (data.action == 'copyItems') {
          commit('setNotification', 'Copied.')
        }
        if (data.action == 'uploadImage') {
          //console.dir(result)
          return result
        }
      })
    }
    
  },
  
  mutations: {
    // todo: use constant for function names. https://vuex.vuejs.org/en/mutations.html
    setItems (state, data) {
      state.items_count = data.count
      state.items = {}
      data.items.forEach(item => {
        Vue.set(state.items, item._id, item)
      })
    },
    setItem (state, item) {
      Vue.set(state.items, item._id, item)
    },
    setNotification (state, message) {
      state.notification = message
    },
    clearNotification (state) {
      state.notification = null
    }
  }
})
