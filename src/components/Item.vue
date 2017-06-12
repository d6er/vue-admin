<template>
  <div>
    <h1 class="title is-5">{{ item.title }}</h1>
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
    </nav>
    <div class="tabs">
      <ul>
        <li v-for="tab in tabs" :class="$route.params.tab == tab.id ? 'is-active' : ''">
          <router-link :to="'/item/' + $route.params.id + '/' + tab.id" replace>
            <span class="icon is-small"><i class="fa" :class="tab.icon"></i></span>
            <span>{{ tab.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <detail v-show="$route.params.tab == 'detail'" :item.sync="item"/>
    <picture v-show="$route.params.tab == 'picture'" :item.sync="item"/>
    <description v-show="$route.params.tab == 'description'" :item.sync="item"/>
  </div>
</template>

<script>
import Detail from './ItemTabs/Detail.vue'
import Picture from './ItemTabs/Picture.vue'
import Description from './ItemTabs/Description.vue'

export default {
  data() {
    return {
      tabs: [
        { id: 'detail', name: 'Detail', icon: 'fa-list-alt' },
        { id: 'picture', name: 'Picture', icon: 'fa-picture-o' },
        { id: 'description', name: 'Description', icon: 'fa-file-text-o' }
      ]
    }
  },
  computed: {
    item() {
      // https://github.com/vuejs/vue/issues/1056
      // https://forum.vuejs.org/t/vuex-v-model-on-property-in-nested-object/6242/2
      // POINT: disconnect item from vuex
      return Object.assign({}, this.$store.state.items[this.$route.params.id])
    }
  },
  asyncData ({ store, route: { params: { id } } }) {
    if (id != 'new') {
      return store.dispatch('callApi', { action: 'fetchItem', item_id: parseInt(id) })
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
    }
  },
  components: {
    Detail: Detail,
    Picture: Picture,
    Description: Description
  }
}
</script>
