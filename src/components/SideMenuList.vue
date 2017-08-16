<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="filter in filters">
      <li v-if="!filter.foreach">
        <router-link :to="'/items/' + filter.name">
          {{ filter.name }}
        </router-link>
        <SideMenuList v-if="hasChildren(filter.name)"
                      :parent="filter.name"
                      :depth="parseInt(depth) + 1"/>
      </li>
      <li v-if="filter.foreach != ''" v-for="elm in $store.state[filter.foreach]">
        <router-link :to="'/items/' + filter.name + ':' + elm">
          {{ elm }}
        </router-link>
        <SideMenuList v-if="hasChildren(filter.name)"
                      :parent="filter.name"
                      :depth="parseInt(depth) + 1"/>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  name: 'SideMenuList', // required for recursive components
  props: [ 'parent', 'depth' ],
  created: function () {
    console.dir('=> ' + this.depth + ' ' + this.parent)
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
