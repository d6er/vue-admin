<template>
  <ul :class="{ 'menu-list': depth == 0 }">
    <template v-for="menuItem in menuItems">
      <li>
        <router-link :to="getFilterUrl(menuItem)" :class="{ 'is-active': isActive(menuItem) }">
          {{ menuItem }}
          <span class="tag is-rounded is-pulled-right">123</span>
        </router-link>
        <FilterTree v-if="hasDrillDowns(menuItem) && menuItem == path[depth]"
                    :arrPath="[...arrPath, menuItem]"/>
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
  
  computed: {
    depth () {
      return this.arrPath.length
    },
    list () {
      return this.$store.state.lists.find(list => list.name == this.$route.params.list)
    },
    menuItems () {
      if (this.depth == 0) {
        return this.list.filters.map(filter => filter.name)
      }
      let filter = this.list.filters.find(filter => filter.name == this.arrPath[0])
      let drilldownField = filter.drilldowns[this.depth - 1]
      if (drilldownField == 'account') {
        return this.$store.state.accounts.map(account => account.emails[0].value)
      } else if (drilldownField == 'labelIds') {
        return [ 'UNREAD', 'IMPORTANT', 'CATEGORY_UPDATES', 'CATEGORY_PROMOTIONS' ]
      } else {
        return [ drilldownField ]
      }
    },
    path () {
      return this.$route.params.filter.split(':')
    }
  },
  
  methods: {
    getFilterUrl(menuItem) {
      return '/' + this.$route.params.list + '/' + [ ...this.arrPath, menuItem ].join(':')
    },
    hasDrillDowns(menuItem) {
      let filter = null
      if (this.depth == 0) {
        filter = this.list.filters.find(filter => filter.name == menuItem)
      } else {
        filter = this.list.filters.find(filter => filter.name == this.arrPath[0])
      }
      return filter.drilldowns && filter.drilldowns.length > this.depth
    },
    isActive(menuItem) {
      return [ ...this.arrPath, menuItem ].join(':') == this.$route.params.filter
    }
  }
}
</script>
