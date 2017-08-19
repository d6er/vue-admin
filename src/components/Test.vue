<template>
  <pre>
    {{ filter }}
  </pre>
</template>

<script>
export default {
  computed: {
    filter: function () {
      
      const filter = {
        queries: [],
        sorting: [],
        columns: []
      }
      
      const path = this.$route.params.filter.split('/')
      for (let i in path) {
        let arr = path[i].split(/:/)
        
        let thisFilter = JSON.parse(JSON.stringify(
          this.$store.state.filters.item.find(filter => filter.name == arr[0])
        )) // deep copy
        
        if (arr.length == 2) {
          let varQuery = {}
          varQuery[thisFilter.foreach] = arr[1]
          filter.queries.push(varQuery)
        }
        
        if (thisFilter.sorting) {
          filter.sorting = thisFilter.sorting
        }
        if (thisFilter.columns) {
          filter.columns = thisFilter.columns
        }
      }
      
      return filter
    }
  }
}
</script>
