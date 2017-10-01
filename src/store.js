import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

import config from '../config/client'

Vue.use(Vuex)

export function createStore () {
  
  return new Vuex.Store({
    
    state: {
      
      lists: config.lists,
      
      user: null,
      
      account: [ 'Account1', 'Account2', 'Account3' ],
      
      status: [ 'published', 'unpublished', 'draft', 'trash' ],
      
      items: [],
      
      messages: [],
      
      paging: [],
      
      mergedFilter: {},
      
      filterForm: {},
      
      currentList: {},

      notification: null
    },
    
    // https://vuex.vuejs.org/en/strict.html
    strict: process.env.NODE_ENV !== 'production',
    
    actions: {
      
      callApi ({ commit, state }, data) {
        
        if (data.action != 'createUser') {
          data.user_id = state.user._id
        }
        
        return api.call(data).then(result => {
          
          result.callData = data
          
          // todo: map action and commit
          // https://github.com/vuejs/vuex/issues/755
          if (data.action == 'fetchItems' || data.action == 'refreshItems') {
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
          }
          
          return result
        })
      }
    },
    
    mutations: {
      
      // filter
      setFilterForm (state, filterForm) {
        state.filterForm = filterForm
      },
      
      setCurrentList(state, list) {
        state.currentList = list
      },
      
      // item
      // todo: use constant for function names.
      // https://vuex.vuejs.org/en/mutations.html
      setItems (state, data) {
        // todo: set current list
        state.currentList = state.lists.find(l => l.name == data.callData.list)
        state.paging = data.paging
        state.mergedFilter = data.mergedFilter
        state.items = []
        data.items.forEach((item, index) => {
          Vue.set(state.items, index, item)
        })
      },
      
      clearItems (state) {
        state.items = []
      },
      
      setItem (state, data) {
        state.paging = data.paging
        let index = state.items.findIndex(e => e._id == data.item._id)
        Vue.set(state.items, index, data.item)
      },
      
      // notification
      setNotification (state, message) {
        state.notification = message
      },
      
      clearNotification (state) {
        state.notification = null
      }
    }
  })
  
}
