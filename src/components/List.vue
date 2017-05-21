<template>
  <div id="list">
    <table class="table">
      <thead>
        <th>ID</th>
        <th>Title</th>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
        </tr>
      </tbody>
    </table>
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
