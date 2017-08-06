import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    user: null,
    fields: {
      item: [
        {
          name: 'title',
          type: 'text'
        },
        {
          name: 'subtitle',
          type: 'text'
        },
        {
          name: 'status',
          type: 'select',
          values: [ 'published', 'unpublished', 'draft', 'trash' ]
        },
        {
          name: 'updated',
          type: 'datetime'
        },
        {
          name: 'created',
          type: 'datetime'
        }
      ]
    },
    filters: {
      items: [
        {
          name: 'published',
          query: [
            { field: 'status', condition: 'is equal to', value: 'published' }
          ],
          sort: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          fields: [ 'picture', 'title', 'status', 'updated' ]
        },
        {
          name: 'unpublished',
          query: [
            { field: 'status', condition: 'is equal to', value: 'unpublished' }
          ],
          sort: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          fields: [ 'updated', 'picture', 'title', 'status' ]
        },
        {
          name: 'draft',
          query: [
            { field: 'status', condition: 'is equal to', value: 'draft' }
          ],
          sort: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          fields: [ 'picture', 'title', 'status', 'updated' ]
        },
        {
          name: 'trash',
          query: [
            { field: 'status', condition: 'is equal to', value: 'trash' }
          ],
          sort: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          fields: [ 'title', 'status', 'updated' ]
        },
        {
          name: 'all',
          query: [],
          sort: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          fields: [ 'picture', 'title', 'status', 'updated' ]
        }
      ]
    },
    items: [],
    messages: [],
    paging: [],
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
      state.items = []
      data.items.forEach((item, index) => {
        Vue.set(state.items, index, item)
      })
    },
    setItem (state, item) {
      const index = state.items.findIndex(e => { return e._id == item._id })
      Vue.set(state.items, index, item)
    },
    setNotification (state, message) {
      state.notification = message
    },
    clearNotification (state) {
      state.notification = null
    }
  }
})
