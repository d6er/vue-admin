<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="filter in filters">
      <li v-if="!filter.foreach">
        <router-link :to="'/' + $route.params.list + '/' + getFilterUrl(filter.name)"
                     :class="{ 'is-active': isActive(parentPath + '/' + encodeURIComponent(filter.name)) }"
                     class="is-capitalized">
          {{ filter.name }}
        </router-link>
        <FilterTree v-if="hasChildren(filter.name) && filter.name == path[depth]"
                    :parent="filter.name"
                    :parentPath="getFilterUrl(filter.name)"
                    :depth="parseInt(depth) + 1"/>
      </li>
      <li v-if="filter.foreach != ''" v-for="elm in $store.state[filter.foreach]">
        <router-link :to="'/' + $route.params.list + '/' + getFilterUrl(filter.name + ':' + elm)"
                     :class="{ 'is-active': isActive(parentPath + '/' + filter.name + ':' + elm) }"
                     class="is-capitalized">
          {{ elm }}
        </router-link>
        <FilterTree v-if="hasChildren(filter.name) && filter.name + ':' + elm == path[depth]"
                    :parent="filter.name"
                    :parentPath="getFilterUrl(filter.name + ':' + elm)"
                    :depth="parseInt(depth) + 1"/>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  
  name: 'FilterTree', // required for recursive components
  
  // https://vuejs.org/v2/guide/components.html#Prop-Validation
  props: {
    parent: {
      type: String,
      default: ''
    },
    parentPath: {
      type: String,
      default: ''
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  
  computed: {
    list() {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    filters() {
      return this.list.filters.filter(filter => filter.parent == this.parent)
    },
    path() {
      return this.$route.params.filter.split(',')
    }
  },
  
  methods: {
    getFilterUrl(filterName) {
      return this.parentPath + ',' + encodeURIComponent(filterName)
    },
    hasChildren(filterName) {
      return this.list.filters.some(filter => filter.parent == filterName)
    },
    isActive(path) {
      // todo: bug when paging
      return this.$route.path == path
    }
  }
}
</script>
