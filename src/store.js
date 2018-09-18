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
          if (data.action == 'fetchFilters') {
            commit('setFilters', payload)
          }
          if (data.action == 'saveFilter') {
            commit('setNotification', 'Filter has been saved.')
            commit('setFilters', payload)
          }
          if (data.action == 'deleteFilter') {
            commit('setNotification', 'Filter has been deleted.')
            commit('setFilters', payload)
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
      
      setItem (state, payload) {
        state.paging = payload.result.paging
        let list = state.lists.find(l => l.name == payload.callData.list)
        let index = list.items.findIndex(e => e._id == payload.result.item._id)
        Vue.set(list.items, index, payload.result.item)
      },
      
      setFilters (state, payload) {
        let list = state.lists.find(l => l.name == payload.callData.list)
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
