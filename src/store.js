import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

import config from '../config/client'

Vue.use(Vuex)

export function createStore () {
  
  return new Vuex.Store({
    
    state: {
      
      user: null,
      
      accounts: [],
      
      lists: config.lists,
      
      paging: [],
      
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
          
          let payload = {
            result: result,
            callData: data
          }
          
          // Account
          if (data.action == 'fetchAccounts') {
            commit('setAccounts', payload)
          }
          
          // Filter
          if (data.action == 'fetchFilters') {
            commit('setFilters', payload)
          }
          if (data.action == 'saveFilter') {
            commit('setNotification', 'Filter has been saved.')
          }
          if (data.action == 'deleteFilter') {
            commit('setNotification', 'Filter has been deleted.')
          }
          if (data.action == 'restoreDefaultFilters') {
            commit('setNotification', 'Default filters have been restored.')
          }
          if (data.action == 'saveFilter'
              || data.action == 'deleteFilter'
              || data.action == 'restoreDefaultFilters') {
            commit('setFilters', payload)
          }
          
          // Item
          // todo: map action and commit
          // https://github.com/vuejs/vuex/issues/755
          if (data.action == 'fetchItems' || data.action == 'refreshList') {
            commit('setItems', payload)
          }
          if (data.action == 'fetchItem') {
            commit('setItem', payload)
          }
          if (data.action == 'saveItem') {
            commit('setNotification', 'Item been sent saved.')
          }
          if (data.action == 'copyItems') {
            commit('setNotification', 'Copied.')
          }
          if (data.action == 'uploadImage') {
            //console.dir(payload)
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
      setItems (state, payload) {
        // todo: set current list
        state.paging = payload.result.paging
        state.mergedFilter = payload.result.mergedFilter
        
        let list = state.lists.find(l => l.name == payload.callData.list)
        list.items = []
        payload.result.items.forEach((item, index) => {
          Vue.set(list.items, index, item)
        })
      },
      
      clearItems (state) {
        state.items = []
      },
      
      setAccounts (state, payload) {
        state.accounts = payload.result
      },
      
      setItem (state, payload) {
        state.paging = payload.result.paging
        let list = state.lists.find(l => l.name == payload.callData.list)
        let index = list.items.findIndex(e => e._id == payload.result.item._id)
        Vue.set(list.items, index, payload.result.item)
      },
      
      setFilters (state, payload) {
        let list = state.lists.find(l => l.name == payload.callData.listName)
        list.filters = payload.result
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
