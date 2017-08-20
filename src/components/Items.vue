<template>
  <div>
    <nav class="level">
      <div class="level-left">
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
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>
            <span>Delete</span>
          </button>
        </div>
        <div class="level-item" v-if="!checkedItems.length">
          <router-link to="/item/new/detail" class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </span>
            <span>Create</span>
          </router-link>
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
              <router-link :to="prevPage" class="button is-small"
                           v-if="$store.state.paging.hasPrev">
                <span class="icon is-small">
                  <i class="fa fa-angle-left"></i>
                </span>
              </router-link>
              <button class="button is-small" disabled v-else>
                <span class="icon is-small">
                  <i class="fa fa-angle-left"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <router-link :to="nextPage" class="button is-small"
                           v-if="$store.state.paging.hasNext">
                <span class="icon is-small">
                  <i class="fa fa-angle-right"></i>
                </span>
              </router-link>
              <button class="button is-small" disabled v-else>
                <span class="icon is-small">
                  <i class="fa fa-angle-right"></i>
                </span>
              </button>
            </p>
          </div>
        </div>
        <p class="level-item">
          <button class="button is-small" @click="customize">
            <span class="icon is-small">
              <i class="fa fa-cogs" aria-hidden="true"></i>
            </span>
            <span>Customize</span>
          </button>
        </p>
      </div>
    </nav>

    <div class="modal" :class="{ 'is-active': isCustomizeActive }">
      <div class="modal-background" @click="closeCustomize"></div>
      <div class="modal-content">
        <div class="box">
          <h1 class="title is-5">Customize columns</h1>
          <hr/>
          <li>
            <ul v-for="column in filter.fields">
              {{ column }}
            </ul>
          </li>
        </div>
      </div>
      <button class="modal-close is-large" @click="closeCustomize"></button>
    </div>
    <ListFilter v-if="showFilter" :filter.sync="filterForm"/>
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="checkedAll" @click="checkAll">
          </th>
          <th v-for="column in filter.columns">
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>
            <input type="checkbox" :value="item._id" v-model="checkedItems">
          </td>
          <td v-for="column in filter.columns">
            <template v-if="column == 'title'">
              <router-link :to="'/item/' + item._id + '/detail'">
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
import ListFilter from './ListFilter.vue'

export default {
  data () {
    return {
      keyword: '',
      checkedItems: [],
      checkedAll: false,
      isCustomizeActive: false,
      showFilter: false,
      filter: {},
      filterForm: {}
    }
  },
  /*
  asyncData ({ store, route: { params: { filter } } }) {
    //this.currentFilter(filter)
    return store.dispatch('callApi', { action: 'fetchItems',
                                       queries: this.filter.queries,
                                       sorting: this.filter.sorting,
                                       columns: this.filter.columns,
                                       page: page })
  },
  */
  created: function() {
    //const filter = this.currentFilter(this.$route.params.filter)
    //this.filter = JSON.parse(JSON.stringify(filter)) // deep copy
  },
  computed: {
    items() {
      return this.$store.state.items
    },
    prevPage() {
      const page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/items/' + this.$route.params.status + '/' + (page - 1)
    },
    nextPage() {
      const page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/items/' + this.$route.params.status + '/' + (page + 1)
    }
  },
  watch: {
    '$route': 'handleRouteChange',
    filterForm: {
      handler: 'handleFilterFormChange',
      deep: true // https://vuejs.org/v2/api/#watch
    }
  },
  components: {
    ListFilter: ListFilter
  },
  methods: {
    
    handleFilterFormChange() {
      const filter = { queries: [], sorting: [], columns: [] }
      
      const path = this.$route.params.filter.split('/')
      for (let i in path) {
        let arr = path[i].split(/:/)
        
        let thisFilter = {}
        if (arr[0] == this.filterForm.name) {
          thisFilter = this.filterForm
        } else {
          let refFilter = this.$store.state.filters.item.find(filter => filter.name == arr[0])
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
      console.dir(filter.queries)
      
      this.filter = filter
      this.fetchItems()
    },
    
    handleRouteChange() {
      
      let path = this.$route.params.filter.split('/')
      let arr = path[path.length-1].split(/:/)
      let refFilter = this.$store.state.filters.item.find(filter => filter.name == arr[0])
      let thisFilter = JSON.parse(JSON.stringify(refFilter)) // deep copy
      
      this.filterForm = thisFilter
    },
    
    fetchItems() {
      this.$store.dispatch('callApi', { action: 'fetchItems',
                                        queries: this.filter.queries,
                                        sorting: this.filter.sorting,
                                        columns: this.filter.columns,
                                        page: 1 })
    },
    
    // Checkbox
    checkAll() {
      if (this.checkedAll) {
        this.checkedItems = Object.keys(this.items).map(i => parseInt(i))
      } else {
        this.checkedItems = []
      }
    },
    copyItems() {
      this.$store.dispatch('callApi', { action: 'copyItems', item_ids: this.checkedItems })
    },
    deleteItems() {
      this.$store.dispatch('callApi', { action: 'deleteItems', item_ids: this.checkedItems })
    },
    
    // Customize
    customize() {
      this.isCustomizeActive = !this.isCustomizeActive
    },
    closeCustomize() {
      this.isCustomizeActive = false
    }
  }
}
</script>
