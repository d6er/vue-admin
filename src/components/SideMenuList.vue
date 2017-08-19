<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="filter in filters">
      <li v-if="!filter.foreach">
        <router-link :to="parentPath + '/' + filter.name">
          {{ filter.name }}
        </router-link>
        <SideMenuList v-if="hasChildren(filter.name)"
                      :parent="filter.name"
                      :parentPath="parentPath + '/' + filter.name"
                      :depth="parseInt(depth) + 1"/>
      </li>
      <li v-if="filter.foreach != ''" v-for="elm in $store.state[filter.foreach]">
        <router-link :to="parentPath + '/' + filter.name + ':' + elm">
          {{ elm }}
        </router-link>
        <SideMenuList v-if="hasChildren(filter.name)"
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
    }
  },
  methods: {
    hasChildren(parent) {
      return this.$store.state.filters.item.some(filter => filter.parent == parent)
    }
  }
}
</script>
