<template>
  <div id="tab-description">
    <textarea v-model="item.description" class="textarea" placeholder="Description"></textarea>
  </div>
</template>
<script>
export default {
  computed: {
    item () {
      if (this.$route.params.id == 'new') {
        return {}
      } else {
        // POINT: disconnect item from vuex
        return Object.assign({}, this.$store.state.items[this.$route.params.id])
      }
    }
  }
}
</script>
