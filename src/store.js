import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    user: null,
    setting: {
      items: {
        sort: { field: 'title', order: 1 },
        columns: [ 'picture', 'title', 'status', 'updated' ]
      },
      messages: {
        sort: { field: 'title', order: 1 },
        columns: [ 'picture', 'title', 'status', 'updated' ]
      }
    },
    filters: {
      items: [
        {
          name: 'published',
          query: { 'status': 'published' },
          sort: { 'updated' : -1, 'title': 1 },
          fields: [ 'picture', 'title', 'status', 'updated' ]
        },
        {
          name: 'unpublished',
          query: { 'status': 'unpublished' },
          sort: { 'updated' : -1, 'title': 1 },
          fields: [ 'picture', 'title', 'status', 'updated' ]
        }
      ]
    },
    items: {},
    messages: {},
    paging: {},
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
      state.paging = data.paging
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
