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
      
      filter: {},
      
      filterForm: {},
      
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
            return result
          }
        })
      }
    },
    
    mutations: {
      
      // filter
      setFilter (state, filter) {
        state.filter = filter
      },
      setFilterForm (state, filterForm) {
        state.filterForm = filterForm
      },
      
      setFilter2 (state, filterForm) {
        
        
        let filter = { queries: [], sorting: [], columns: [] }
        let listName = state.route.params.list
        let definedFilters = state.lists.find(e => e.name == listName).filters
        let path = state.route.params.filter.split(',')
        
        for (let i in path) {
          let arr = path[i].split(/:/)
          
          let thisFilter = {}
          if (filterForm && arr[0] == filterForm.name) {
            thisFilter = filterForm
          } else {
            let refFilter = definedFilters.find(filter => filter.name == arr[0])
            thisFilter = JSON.parse(JSON.stringify(refFilter)) // deep copy
          }
          
          // queries
          if (arr.length == 2) {
            filter.queries.push({
              field: thisFilter.foreach,
              condition: 'is equal to',
              value: arr[1]
            })
          }
          if (thisFilter.queries) {
            filter.queries.push.apply(filter.queries, thisFilter.queries)
          }
          
          // sorting
          if (thisFilter.sorting) {
            filter.sorting = thisFilter.sorting
          }
          
          // columns
          if (thisFilter.columns) {
            filter.columns = thisFilter.columns
          }
        }
        
        state.filter = filter
      },
      
      // item
      // todo: use constant for function names. https://vuex.vuejs.org/en/mutations.html
      setItems (state, data) {
        state.paging = data.paging
        state.items = []
        data.items.forEach((item, index) => {
          Vue.set(state.items, index, item)
        })
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
