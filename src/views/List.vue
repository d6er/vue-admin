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
            <button @click="refreshList" class="button is-small">
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
          <button @click="showFilterForm=!showFilterForm" class="button is-link is-small">
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
    
    <FilterForm v-if="showFilterForm"/>
    
    <table class="table is-narrow is-fullwidth">
      <thead>
        <tr>
          <th>
            
          </th>
          <th v-for="column in filter.columns" class="is-capitalized">
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
            <template v-if="isLinkToDetail(column)">
              <router-link :to="getDetailLinkURL(item._id)">
                {{ item[column] }}
              </router-link>
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
      showFilterForm: false
    }
  },
  
  asyncData ({ store, route: { params: { list, filter, page } } }) {
    return store.dispatch('callApi', { action: 'fetchItems',
                                       list: list,
                                       filter: filter,
                                       page: page })
  },
  
  computed: {
    list () {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    items () {
      return this.$store.state.items
    },
    filter () {
      return this.$store.state.mergedFilter
    },
    prevPage () {
      const page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/' + this.list.name + '/' + this.$route.params.filter + '/p' + (page - 1)
    },
    nextPage () {
      const page = this.$route.params.page ? parseInt(this.$route.params.page) : 1
      return '/' + this.list.name + '/' + this.$route.params.filter + '/p' + (page + 1)
    }
  },
  
  watch: {
    $route: 'handleRouteChange',
  },
  
  components: {
    FilterForm: FilterForm
  },
  
  methods: {
    
    isLinkToDetail(fieldName) {
      let field = this.list.fields.find(f => f.name == fieldName)
      return field.linkToDetail
    },
    
    handleRouteChange() {
      this.fetchItems()
    },
    
    getDetailLinkURL(_id) {
      return '/' + this.$route.params.list + '/' + this.$route.params.filter + '/' + _id + '/detail'
    },
    
    fetchItems() {
      this.$store.dispatch('callApi', { action: 'fetchItems',
                                        list: this.$route.params.list,
                                        filter: this.$route.params.filter,
                                        page: this.$route.params.page })
    },
    
    refreshList() {
      this.$store.dispatch('callApi', { action: 'refreshList',
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
