<template>
  <div id="list">
    {{ $route.hash }}
    List!
    <div v-for="item in items">
      {{ item.id }}: {{ item.title }}
    </div>
  </div>
</template>

<script>
//console.dir(this.$route)

export default {
  name: 'list',
  computed: {
    items() {
      return this.$store.state.items
    }
  }
}
</script>
