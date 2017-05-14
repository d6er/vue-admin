import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    items: [
      {
        id: 1,
        title: 'item foo'
      },
      {
        id: 2,
        title: 'item bar'
      }
    ]
  },
  strict: true,
  mutations: {
    login(state) {
      state.token = 'foo'
    },
    logout(state) {
      state.token = ''
    }
  }
})
