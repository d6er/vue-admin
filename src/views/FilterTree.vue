<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="filter in filters">
      <li v-if="!filter.foreach">
        <router-link :to="parentPath + '/' + encodeURIComponent(filter.name)"
                     :class="{ 'is-active': isActive(parentPath + '/' + encodeURIComponent(filter.name)) }"
                     class="is-capitalized">
          {{ filter.name }}
        </router-link>
        <FilterTree v-if="hasChildren(filter.name) && filter.name == path[depth]"
                    :parent="filter.name"
                    :parentPath="parentPath + '/' + encodeURIComponent(filter.name)"
                    :depth="parseInt(depth) + 1"/>
      </li>
      <li v-if="filter.foreach != ''" v-for="elm in $store.state[filter.foreach]">
        <router-link :to="parentPath + '/' + filter.name + ':' + elm"
                     :class="{ 'is-active': isActive(parentPath + '/' + filter.name + ':' + elm) }"
                     class="is-capitalized">
          {{ elm }}
        </router-link>
        <FilterTree v-if="hasChildren(filter.name) && filter.name + ':' + elm == path[depth]"
                    :parent="filter.name"
                    :parentPath="parentPath + '/' + filter.name + ':' + elm"
                    :depth="parseInt(depth) + 1"/>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  
  name: 'FilterTree', // required for recursive components
  
  props: [ 'parent', 'parentPath', 'depth' ],
  
  computed: {
    list() {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    filters() {
      console.log('parent:' + this.parent)
      return this.list.filters.filter(filter => filter.parent == this.parent)
    },
    path() {
      return this.$route.params.filter.split('/')
    }
  },
  
  methods: {
    hasChildren(parent) {
      return this.list.filters.some(filter => filter.parent == parent)
    },
    isActive(path) {
      // todo: bug when paging
      return this.$route.path == path
    }
  }
}
</script>
