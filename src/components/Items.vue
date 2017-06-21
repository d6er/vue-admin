<template>
  <div>
    <h1 class="title is-5">Items</h1>
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
          <a class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-cogs" aria-hidden="true"></i>
            </span>
            <span>Customize</span>
          </a>
        </p>
      </div>
    </nav>
    
    <table class="table is-narrow">
      <thead>
        <tr>
          <th><input type="checkbox" v-model="checkedAll" @click="checkAll"></th>
          <th>Pic</th>
          <th>
            Title
            <span class="icon is-small">
              <i class="fa fa-sort" aria-hidden="true"></i>
            </span>
          </th>
          <th>
            Status
            <span class="icon is-small">
              <i class="fa fa-sort" aria-hidden="true"></i>
            </span>
          </th>
          <th>
            Updated
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
          <td>
            <figure class="image is-32x32">
              <img src="http://bulma.io/images/placeholders/32x32.png">
            </figure>
          </td>
          <td>
            <router-link :to="'/item/' + item._id + '/detail'">
              {{ item._id + ' ' + item.title }}
            </router-link>
          </td>
          <td>
            <span class="tag is-light">{{ item.status }}</span>
          </td>
          <td>
            <span class="tag is-white">{{ item.updated }}</span>
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
      checkedAll: false
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
    }
  }
}
</script>
