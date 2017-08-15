import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

Vue.use(Vuex)

export default new Vuex.Store({
  
  state: {
    user: null,
    accounts: [ 'Account1', 'Account2', 'Account3' ],
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
          name: 'account',
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
        },
        {
          name: 'picture',
          type: 'image'
        }
      ]
    },
    filters: {
      item: [
        {
          name: 'account',
          parent: '',
          foreach: 'accounts',
          queries: [
            { field: 'account', condition: 'is equal to foreach' }
          ],
          sorting: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          columns: [ 'picture', 'title', 'status', 'updated' ]
        },
        {
          name: 'published',
          queries: [
            { field: 'status', condition: 'is equal to', value: 'published' }
          ],
          sorting: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          columns: [ 'picture', 'title', 'status', 'updated' ]
        },
        {
          name: 'unpublished',
          queries: [
            { field: 'status', condition: 'is equal to', value: 'unpublished' }
          ],
          sorting: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          columns: [ 'updated', 'picture', 'title', 'status' ]
        },
        {
          name: 'draft',
          queries: [
            { field: 'status', condition: 'is equal to', value: 'draft' }
          ],
          sorting: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          columns: [ 'picture', 'title', 'status', 'updated' ]
        },
        {
          name: 'trash',
          queries: [
            { field: 'status', condition: 'is equal to', value: 'trash' }
          ],
          sorting: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          columns: [ 'title', 'status', 'updated' ]
        },
        {
          name: 'all',
          queries: [ ],
          sorting: [
            { field: 'updated', order: 'desc' },
            { field: 'title', order: 'asc' }
          ],
          columns: [ 'picture', 'title', 'status', 'updated' ]
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
