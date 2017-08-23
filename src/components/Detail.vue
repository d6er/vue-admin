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
          <router-link :to="tab.id" replace>
            <span class="icon is-small"><i class="fa" :class="tab.icon"></i></span>
            <span>{{ tab.name }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <detail v-show="$route.params.tab == 'detail'" :item.sync="item"/>
    <pictures v-show="$route.params.tab == 'pictures'" :item.sync="item"/>
    <description v-show="$route.params.tab == 'description'" :item.sync="item"/>
  </div>
</template>

<script>
import Detail from './DetailTabs/Detail.vue'
import Pictures from './DetailTabs/Pictures.vue'
import Description from './DetailTabs/Description.vue'

export default {
  data() {
    return {
      tabs: [
        { id: 'detail', name: 'Detail', icon: 'fa-list-alt' },
        { id: 'pictures', name: 'Picture', icon: 'fa-picture-o' },
        { id: 'description', name: 'Description', icon: 'fa-file-text-o' }
      ]
    }
  },
  computed: {
    item() {
      // https://github.com/vuejs/vue/issues/1056
      // https://forum.vuejs.org/t/vuex-v-model-on-property-in-nested-object/6242/2
      // POINT: disconnect item from vuex
      const _id = this.$route.params.id
      const index = this.$store.state.items.findIndex(e => { return e._id == _id })
      return Object.assign({}, this.$store.state.items[index]) // maybe mutation error later
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
    Pictures: Pictures,
    Description: Description
  }
}
</script>
