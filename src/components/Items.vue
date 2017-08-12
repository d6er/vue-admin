<template>
  <div>
    <div class="box">
      <nav class="level">
        <div class="level-left">
          <div class="level-item">
            <button @click="saveFilter" class="button is-info is-small">
              <span class="icon is-small">
                <i class="fa fa-save" aria-hidden="true"></i>
              </span>
              <span>Save</span>
            </button>
          </div>
          <div class="level-item">
            <button class="button is-light is-small">
              <span>Cancel</span>
            </button>
          </div>
          <div class="level-item">
            <button @click="deleteFilter" class="button is-link is-small">
              Delete this filter
            </button>
          </div>
        </div>
      </nav>
      <div class="columns">
        <div class="column field is-narrow">
          <label class="label">Filter name</label>
          <div class="control">
            <input class="input is-small" type="text" v-model="filter.name">
          </div>
        </div>
        <div class="column field is-narrow">
          <label class="label">Queries</label>
          <div class="field has-addons" v-for="(q, idx) in filter.queries">
            <p class="control">
              <span class="select is-small">
                <select v-model="q.field">
                  <option value="" disabled hidden>(field)</option>
                  <option v-for="field in $store.state.fields.item">
                    {{ field.name }}
                  </option>
                </select>
              </span>
            </p>
            <p class="control">
              <span class="select is-small">
                <select v-model="q.condition">
                  <option value="" disabled hidden>(condition)</option>
                  <option>is equal to</option>
                  <option>is not equal to</option>
                  <option>contains</option>
                  <option>does not contain</option>
                </select>
              </span>
            </p>
            <p class="control">
              <input v-model="q.value" class="input is-small" type="text" placeholder="Keyword">
            </p>
            <p class="control">
              <button @click="deleteQuery(idx)" class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </span>
              </button>
            </p>
          </div>
          <a @click="addQuery" class="button is-link is-small">Add query</a>
        </div>
        <div class="column field is-narrow">
          <label class="label">Sorting</label>
          <div class="field has-addons" v-for="(s, idx) in filter.sorting">
            <p class="control">
              <span class="select is-small">
                <select v-model="s.field">
                  <option value="" disabled hidden>(field)</option>
                  <option v-for="field in $store.state.fields.item">
                    {{ field.name }}
                  </option>
                </select>
              </span>
            </p>
            <p class="control">
              <span class="select is-small">
                <select v-model="s.order">
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </select>
              </span>
            </p>
            <p class="control">
              <button @click="deleteSorting(idx)" class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </span>
              </button>
            </p>
          </div>
          <a @click="addSorting" class="button is-link is-small">Add sorting</a>
        </div>
        <div class="column field is-narrow">
          <label class="label">Columns</label>
          <div class="field has-addons" v-for="(c, idx) in filter.columns">
            <p class="control">
              <span class="select is-small">
                <select v-model="filter.columns[idx]">
                  <option value="" disabled hidden>(field)</option>
                  <option v-for="field in $store.state.fields.item">
                    {{ field.name }}
                  </option>
                </select>
              </span>
            </p>
            <p class="control">
              <button class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-arrow-up" aria-hidden="true"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-arrow-down" aria-hidden="true"></i>
                </span>
              </button>
            </p>
            <p class="control">
              <button @click="deleteColumn(idx)"class="button is-small">
                <span class="icon is-small">
                  <i class="fa fa-times" aria-hidden="true"></i>
                </span>
              </button>
            </p>
          </div>
          <a @click="addColumn" class="button is-link is-small">Add column</a>
          
        </div>
      </div>
    </div>
    
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
              <input v-model="keyword" class="input is-small" type="text" placeholder="Find items"
                     @keyup="fetchItems">
            </p>
            <p class="control">
              <button @click="fetchItems" class="button is-small">
                Search
              </button>
            </p>
          </div>
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
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="checkedAll" @click="checkAll">
          </th>
          <th v-for="column in filter.columns">
            {{ column }}
            <span class="icon is-small">
              <i class="fa fa-sort" aria-hidden="true"></i>
            </span>
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
export default {
  data () {
    return {
      keyword: '',
      checkedItems: [],
      checkedAll: false,
      isCustomizeActive: false,
      showFilter: false,
      filter: {
        queries: [],
        sorting: [],
        columns: []
      }
    }
  },
  asyncData ({ store, route: { params: { status, page } } }) {
    const filter = store.state.filters.item.find(e => { return e.name == status })
    return store.dispatch('callApi', { action: 'fetchItems',
                                       queries: filter.queries,
                                       sorting: filter.sorting,
                                       columns: filter.columns,
                                       page: page })
  },
  created: function() {
    const status = this.$route.params.status
    const filter = this.$store.state.filters.item.find(e => { return e.name == status })
    this.filter = JSON.parse(JSON.stringify(filter)) // deep copy
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
    //'$route': 'fetchItems'
    '$route': 'updateFilter',
    filter: {
      handler: 'fetchItems',
      deep: true // https://vuejs.org/v2/api/#watch
    }
  },
  methods: {
    updateFilter() {
      const status = this.$route.params.status
      const filter = this.$store.state.filters.item.find(e => { return e.name == status })
      this.filter = JSON.parse(JSON.stringify(filter)) // deep copy
      this.fetchItems()
    },
    fetchItems() {
      this.$store.dispatch('callApi', { action: 'fetchItems',
                                        queries: this.filter.queries,
                                        sorting: this.filter.sorting,
                                        columns: this.filter.columns,
                                        page: this.$route.params.page })
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
    },
    
    // Filter
    saveFilter() {
    },
    deleteFilter() {
    },
    addQuery() {
      const idx = this.filter.queries.length
      this.$set(this.filter.queries, idx, { field: '', condition: '', value: '' })
    },
    addSorting() {
      const idx = this.filter.sorting.length
      this.$set(this.filter.sorting, idx, { field: '', order: 'asc' })
    },
    addColumn() {
      const idx = this.filter.columns.length
      this.$set(this.filter.columns, idx, '')
    },
    deleteQuery(idx) {
      this.$delete(this.filter.queries, idx)
    },
    deleteSorting(idx) {
      this.$delete(this.filter.sorting, idx)
    },
    deleteColumn(idx) {
      this.$delete(this.filter.columns, idx)
    }
  }
}
</script>
