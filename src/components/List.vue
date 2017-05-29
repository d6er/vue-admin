<template>
  <div>
    <h1 class="title is-4">Items</h1>
    <nav class="level">
      <div class="level-left">
        <div class="level-item" v-if="checkedItems.length">
          <button class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-files-o" aria-hidden="true"></i>
            </span>
            <span>Copy</span>
          </button>
        </div>
        <div class="level-item" v-if="checkedItems.length">
          <button class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>
            <span>Delete</span>
          </button>
        </div>
        <div class="level-item" v-if="!checkedItems.length">
          <router-link to="/item/new" class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </span>
            <span>Create</span>
          </router-link>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <div class="field has-addons">
            <p class="control">
              <input class="input is-small" type="text" placeholder="Find items">
            </p>
            <p class="control">
              <button class="button is-small">
                Search
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
          <th><input type="checkbox"></th>
          <th></th>
          <th>Title</th>
          <th>Status</th>
          <th>Updated</th>
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
            <router-link :to="'/item/' + item._id">{{ item.title }}</router-link>
          </td>
          <td>
            {{ item.status }}
          </td>
          <td>
            {{ item.updated }}
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
      checkedItems: []
    }
  },
  asyncData ({ store, route }) {
    return store.dispatch('fetchItems', {})
  },
  computed: {
    items() {
      return this.$store.state.items
    }
  }
}
</script>
