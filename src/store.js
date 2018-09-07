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
      
      accounts: [ 'Account1', 'Account2', 'Account3' ],
      
      status: [ 'published', 'unpublished', 'draft', 'trash' ],
      
      paging: [],
      
      mergedFilter: {},
      
      filterForm: {},
      
      currentList: {},

      isNavBarActive: false, // todo: delete
      
      isDropdownActive: false,
      
      isFilterFormActive: false,
      
      notification: null
    },
    
    // https://vuex.vuejs.org/en/strict.html
    strict: process.env.NODE_ENV !== 'production',
    
    actions: {
      
      setApiListener ({ commit, state }) {
        api.setJob(0, message => {
          commit('setNotification', message)
        })
      },
      
      callApi ({ commit, state }, data) {
        
        // todo: handle 'auth error'
        if (data.action != 'createUser') {
          data.user_id = state.user._id
        }
        
        return api.call(data).then(result => {
          
          result.callData = data
          
          // todo: map action and commit
          // https://github.com/vuejs/vuex/issues/755
          if (data.action == 'fetchItems' || data.action == 'refreshList') {
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
          if (data.action == 'fetchFilters') {
            commit('setFilters', result)
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
        state.paging = data.paging
        state.mergedFilter = data.mergedFilter
        
        let list = state.lists.find(l => l.name == data.callData.list)
        list.items = []
        data.items.forEach((item, index) => {
          Vue.set(list.items, index, item)
        })
      },
      
      clearItems (state) {
        state.items = []
      },
      
      setItem (state, data) {
        state.paging = data.paging
        let list = state.lists.find(l => l.name == data.callData.list)
        let index = list.items.findIndex(e => e._id == data.item._id)
        Vue.set(list.items, index, data.item)
      },
      
      setFilters (state, data) {
        console.dir(data)
        let list = state.lists.find(l => l.name == data.callData.list)
        data.forEach((filter, index) => {
          Vue.set(list.filters, index, filter)
        })
      },
      
      // todo: delete
      toggleNavBar (state) {
        state.isNavBarActive = !state.isNavBarActive
      },
      
      toggleDropdown (state) {
        state.isDropdownActive = !state.isDropdownActive
      },
      
      toggleFilterForm (state) {
        state.isFilterFormActive = !state.isFilterFormActive
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
