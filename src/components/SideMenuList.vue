<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="filter in filters">
      <li v-if="!filter.foreach">
        <router-link :to="parentPath + '/' + filter.name"
                     :class="{ 'is-active': isActive(parentPath + '/' + filter.name) }">
          {{ filter.name }}
        </router-link>
        <SideMenuList v-if="hasChildren(filter.name) && filter.name == path[depth]"
                      :parent="filter.name"
                      :parentPath="parentPath + '/' + filter.name"
                      :depth="parseInt(depth) + 1"/>
      </li>
      <li v-if="filter.foreach != ''" v-for="elm in $store.state[filter.foreach]">
        <router-link :to="parentPath + '/' + filter.name + ':' + elm"
                     :class="{ 'is-active': isActive(parentPath + '/' + filter.name + ':' + elm) }">
          {{ elm }}
        </router-link>
        <SideMenuList v-if="hasChildren(filter.name) && filter.name + ':' + elm == path[depth]"
                      :parent="filter.name"
                      :parentPath="parentPath + '/' + filter.name + ':' + elm"
                      :depth="parseInt(depth) + 1"/>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'SideMenuList', // required for recursive components
  props: [ 'parent', 'parentPath', 'depth' ],
  created: function () {
    //console.dir('=> ' + this.depth + ' ' + this.parent)
  },
  computed: {
    filters() {
      return this.$store.state.filters.item.filter(filter => filter.parent == this.parent)
    },
    path() {
      return this.$route.params.filter.split('/')
    }
  },
  methods: {
    hasChildren(parent) {
      return this.$store.state.filters.item.some(filter => filter.parent == parent)
    },
    isActive(path) {
      return this.$route.path == path
    }
  }
}
</script>
