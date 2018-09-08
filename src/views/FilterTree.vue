<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="filter in filters">
      <li v-if="!filter.foreach">
        <router-link :to="getFilterUrl(filter.name)"
                     :class="{ 'is-active': isActive(filter.name) }"
                     class="is-capitalized">
          {{ filter.name }}
        </router-link>
        <FilterTree v-if="hasChildren(filter.name) && filter.name == path[depth]"
                    :arrPath="[...arrPath, filter.name]"/>
      </li>
      <li v-if="filter.foreach != ''" v-for="elm in $store.state[filter.foreach]">
        <router-link :to="getFilterUrl(filter.name + ':' + elm)"
                     :class="{ 'is-active': isActive(filter.name + ':' + elm) }"
                     class="is-capitalized">
          {{ elm }}
        </router-link>
        <FilterTree v-if="hasChildren(filter.name) && filter.name + ':' + elm == path[depth]"
                    :arrPath="[...arrPath, filter.name + ':' + elm]"/>
      </li>
    </template>
  </ul>
</template>

<script>
export default {
  
  name: 'FilterTree', // required for recursive components
  
  // https://vuejs.org/v2/guide/components.html#Prop-Validation
  props: {
    arrPath: {
      type: Array,
      default: () => []
    }
  },
  
  /*
  asyncData ({ store, route: { params: { list } } }) {
    let apiData = {
      action: 'fetchFilters',
      list: list
    }
    console.dir(apiData)
    return store.dispatch('callApi', apiData)
  },
  */
  
  computed: {
    depth () {
      return this.arrPath.length
    },
    list () {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    filters () {
      return this.list.filters
    },
    path () {
      return this.$route.params.filter.split(',')
    }
  },
  
  methods: {
    getFilterUrl(filterName) {
      return '/' + this.$route.params.list + '/' + [ ...this.arrPath, filterName ].join(',')
    },
    hasChildren(filterName) {
      return this.list.filters.some(filter => filter.parent == filterName)
    },
    isActive(filterName) {
      return [ ...this.arrPath, filterName ].join(',') == this.$route.params.filter
    }
  }
}
</script>
