<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <button @click="back" class="button is-small">
            <span class="icon">
              <i class="fa fa-angle-left" aria-hidden="true"></i>
            </span>
          </button>
        </div>
        <div class="level-item">
          <button @click="save" class="button is-info is-small">
            <span class="icon is-small">
              <i class="fa fa-save" aria-hidden="true"></i>
            </span>
            <span>Save</span>
          </button>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          {{ $store.state.paging.position }} of {{ $store.state.paging.count }}
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link v-if="$store.state.paging.prevId"
                           :to="'/' + $route.params.list + '/' + $route.params.filter + '/' + $store.state.paging.prevId + '/' + $route.params.tab"
                           class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-angle-left"></i>
                </span>
              </router-link>
              <button v-else class="button is-small" disabled>
                <span class="icon is-small">
                  <i class="fa fa-angle-left"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <router-link v-if="$store.state.paging.nextId"
                           :to="'/' + $route.params.list + '/' + $route.params.filter + '/' + $store.state.paging.nextId + '/' + $route.params.tab"
                           class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-angle-right"></i>
                </span>
              </router-link>
              <button v-else class="button is-small" disabled>
                <span class="icon is-small">
                  <i class="fa fa-angle-right"></i>
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </nav>
    <div class="tabs">
      <ul>
        <li v-for="tab in tabs">
          <router-link :to="tab" replace>
            <span class="is-capitalized">{{ tab }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <router-view :item.sync="item"></router-view>
  </div>
</template>

<script>
export default {
  
  asyncData ({ store, route: { params: { list, filter, id } } }) {
    let definedFilters = store.state.lists.find(e => e.name == list).filters
    let mergedFilter = this.methods.getMergedFilter(filter, definedFilters)
    if (id != 'new') {
      return store.dispatch('callApi', { action: 'fetchItem',
                                         list: list,
                                         filter: mergedFilter,
                                         item_id: id })
    }
  },
  
  watch: {
    $route: 'handleRouteChange'
  },
  
  computed: {
    list() {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    tabs() {
      return this.list.tabs
    },
    item() {
      // https://github.com/vuejs/vue/issues/1056
      // https://forum.vuejs.org/t/vuex-v-model-on-property-in-nested-object/6242/2
      // POINT: disconnect item from vuex
      const index = this.$store.state.items.findIndex(e => e._id == this.$route.params.id)
      return Object.assign({}, this.$store.state.items[index])
    }
  },
  
  methods: {
    save () {
      this.$store.dispatch('callApi', { action: 'saveItem', item: this.item }).then(
        r => {
          this.$router.go(-1)
        },
        e => {
          console.dir(e)
        }
      )
    },
    back () {
      this.$router.go(-1)
    },
    
    handleRouteChange () {
      let list = this.$route.params.list
      let definedFilters = this.$store.state.lists.find(e => e.name == list).filters
      let mergedFilter = this.getMergedFilter(this.$route.params.filter, definedFilters)
      if (this.$route.params.id != 'new') {
        return this.$store.dispatch('callApi', { action: 'fetchItem',
                                                 filter: mergedFilter,
                                                 item_id: parseInt(this.$route.params.id) })
      }
    },
    
    // todo: same method in List.vue
    getMergedFilter(urlFilter, definedFilters) {
      const filter = { queries: [], sorting: [], columns: [] }
      
      const path = urlFilter.split(',')
      for (let i in path) {
        let arr = path[i].split(/:/)
        let thisFilter = {}
        
        let refFilter = definedFilters.find(filter => filter.name == arr[0])
        thisFilter = JSON.parse(JSON.stringify(refFilter)) // deep copy
        
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
      
      return filter
    }
  }
}
</script>
