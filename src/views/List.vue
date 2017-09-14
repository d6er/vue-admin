<template>
  <div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <label class="checkbox">
            <button class="button is-small">
              <input type="checkbox" v-model="checkedAll" @click="checkAll">
            </button>
          </label>
        </div>
        <div class="level-item" v-if="!checkedItems.length">
          <label class="checkbox">
            <button class="button is-small">
               <span class="icon is-small">
                 <i class="fa fa-refresh"></i>
               </span>
            </button>
          </label>
        </div>
        <div class="level-item" v-if="checkedItems.length">
          <button @click="copyItems" class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-files-o" aria-hidden="true"></i>
            </span>
            <span>Copy</span>
          </button>
        </div>
        <div class="level-item" v-if="checkedItems.length">
          <button @click="deleteItems" class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
            </span>
            <span>Delete</span>
          </button>
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input @keyup="fetchItems" v-model="keyword" class="input is-small"
                     type="text" placeholder="Find items">
            </p>
            <p class="control">
              <button @click="fetchItems" class="button is-small">
                Search
              </button>
            </p>
          </div>
        </div>
        <div class="level-item">
          <button @click="showFilter=!showFilter" class="button is-link is-small">
            Search option
          </button>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          {{ $store.state.paging.start }} - {{ $store.state.paging.end }}
          of {{ $store.state.paging.count }}
        </div>
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <router-link v-if="$store.state.paging.hasPrev" :to="prevPage"
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
              <router-link v-if="$store.state.paging.hasNext" :to="nextPage"
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
    
    <FilterForm v-if="showFilter" :filter.sync="filterForm"/>
    
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>
            
          </th>
          <th v-for="column in $store.state.filter.columns" class="is-capitalized">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>
            <input type="checkbox" :value="item._id" v-model="checkedItems">
          </td>
          <td v-for="column in $store.state.filter.columns">
            <template v-if="isLinkToDetail(column)">
              <router-link :to="getDetailLinkURL(item._id)">
                {{ item[column] }}
              </router-link>
              {{ item._id }}
            </template>
            <template v-else-if="column == 'picture'">
              <figure class="image is-32x32">
                <img src="http://bulma.io/images/placeholders/32x32.png">
              </figure>
            </template>
            <template v-else>
              {{ item[column] }}
            </template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import FilterForm from './FilterForm.vue'

export default {
  
  data () {
    return {
      keyword: '',
      checkedItems: [],
      checkedAll: false,
      isCustomizeActive: false,
      showFilter: false,
      filterForm: {}
    }
  },
  
  asyncData ({ store, route: { params: { list, filter, page } } }) {
    let definedFilters = store.state.lists.find(e => e.name == list).filters
    let mergedFilter = this.methods.getMergedFilter(filter, definedFilters)
    store.commit('setFilter', mergedFilter)
    return store.dispatch('callApi', { action: 'fetchItems',
                                       list: list,
                                       filter: mergedFilter,
                                       page: page })
  },
  
  computed: {
    list() {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    items() {
      return this.$store.state.items
    },
    prevPage() {
      const page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/' + this.list.name + '/' + this.$route.params.filter + '/p' + (page - 1)
    },
    nextPage() {
      const page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/' + this.list.name + '/' + this.$route.params.filter + '/p' + (page + 1)
    }
  },
  
  watch: {
    '$route': 'handleRouteChange',
    filterForm: {
      handler: function() {
        let mergedFilter = this.getMergedFilter(this.$route.params.filter, this.list.filters)
        this.$store.commit('setFilter', mergedFilter)
        this.fetchItems()
      },
      deep: true // https://vuejs.org/v2/api/#watch
    }
  },
  
  components: {
    FilterForm: FilterForm
  },
  
  methods: {
    
    isLinkToDetail(fieldName) {
      let field = this.list.fields.find(f => f.name == fieldName)
      return field.linkToDetail
    },
    
    getMergedFilter(urlFilter, definedFilters) {
      const filter = { queries: [], sorting: [], columns: [] }
      
      const path = urlFilter.split(',')
      for (let i in path) {
        let arr = path[i].split(/:/)
        let thisFilter = {}
        if (this.filterForm && arr[0] == this.filterForm.name) {
          thisFilter = this.filterForm
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
      
      return filter
    },
    
    handleRouteChange() {
      
      // todo: avoid short blink when list is changed
      
      let path = this.$route.params.filter.split(',')
      let arr = path[path.length-1].split(/:/)
      let refFilter = this.list.filters.find(filter => filter.name == arr[0])
      let thisFilter = JSON.parse(JSON.stringify(refFilter)) // deep copy
      this.filterForm = thisFilter
    },
    
    getDetailLinkURL(_id) {
      return '/' + this.$route.params.list + '/' + this.$route.params.filter + '/' + _id + '/detail'
    },
    
    fetchItems() {
      this.$store.dispatch('callApi', { action: 'fetchItems',
                                        list: this.$route.params.list,
                                        filter: this.$store.state.filter,
                                        page: this.$route.params.page })
    },
    
    // Checkbox
    checkAll() {
      if (this.checkedAll) {
        this.checkedItems = Object.keys(this.items).map(i => this.items[i]._id)
      } else {
        this.checkedItems = []
      }
    },
    copyItems() {
      this.$store.dispatch('callApi', { action: 'copyItems', item_ids: this.checkedItems })
    },
    deleteItems() {
      this.$store.dispatch('callApi', { action: 'deleteItems', item_ids: this.checkedItems })
    }
    
  }
}
</script>
