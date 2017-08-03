<template>
  <div>
    <h5 class="title is-5">Items</h5>
    
    <div class="box">
    <div class="columns">
      <div class="column is-narrow">
        <h6 class="title is-6">Filters</h6>
        <div class="field has-addons" v-for="i in [1,2]">
          <p class="control">
            <span class="select is-small">
              <select>
                <option>Title</option>
              </select>
            </span>
          </p>
          <p class="control">
            <span class="select is-small">
              <select>
                <option>contains</option>
              </select>
            </span>
          </p>
          <p class="control">
            <input class="input is-small" type="text" placeholder="Keyword">
          </p>
          <p class="control">
            <button class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a class="button is-link is-small">Add filter</a>
        
      </div>
      <div class="column is-narrow">
        
        <h6 class="title is-6">Sorting</h6>
        <div class="field has-addons" v-for="i in [1,2,3,4]">
          <p class="control">
            <span class="select is-small">
              <select>
                <option>Title</option>
              </select>
            </span>
          </p>
          <p class="control">
            <span class="select is-small">
              <select>
                <option>High to Low</option>
              </select>
            </span>
          </p>
          <p class="control">
            <button class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a class="button is-link is-small">Add sorting</a>
      </div>
      <div class="column is-narrow">
        
        <h6 class="title is-6">Columns</h6>
        <div class="field has-addons" v-for="i in [1,2]">
          <p class="control">
            <button class="button is-small">
              Title
            </button>
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
            <button class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a class="button is-link is-small">Add column</a>
        
      </div>
    </div>
    <button class="button is-small is-info">Save</button>
    <button class="button is-small is-light">Cancel</button>
    <button class="button is-small is-link">Delete</button>
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
            <ul v-for="column in $store.state.setting.items.columns">
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
          <th v-for="column in $store.state.setting.items.columns">
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
          <td v-for="column in $store.state.setting.items.columns">
            <template v-if="column == 'title'">
              <router-link :to="'/item/' + item._id + '/detail'">
                {{ item._id + ' ' + item[column] }}
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
export default {
  data () {
    return {
      keyword: '',
      checkedItems: [],
      checkedAll: false,
      isCustomizeActive: false
    }
  },
  asyncData ({ store, route: { params: { status, page } } }) {
    const query = {}
    if (status) {
      query.status = status
    }
    return store.dispatch('callApi', { action: 'fetchItems',
                                       query: query,
                                       page: page })
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
    '$route': 'fetchItems'
  },
  methods: {
    deleteItems() {
      this.$store.dispatch('callApi', { action: 'deleteItems', item_ids: this.checkedItems })
    },
    copyItems() {
      this.$store.dispatch('callApi', { action: 'copyItems', item_ids: this.checkedItems })
    },
    fetchItems() {
      const query = {}
      if (this.$route.params.status) {
        query.status = this.$route.params.status
      }
      if (this.keyword) {
        query.title = this.keyword
      }
      this.$store.dispatch('callApi', { action: 'fetchItems',
                                        query: query,
                                        page: this.$route.params.page })
    },
    checkAll() {
      if (this.checkedAll) {
        this.checkedItems = Object.keys(this.items).map(i => parseInt(i))
      } else {
        this.checkedItems = []
      }
    },
    customize() {
      this.isCustomizeActive = !this.isCustomizeActive
    },
    closeCustomize() {
      this.isCustomizeActive = false
    }
  }
}
</script>
