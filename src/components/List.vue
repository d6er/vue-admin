<template>
  <div id="list">
    <table class="table">
      <thead>
        <th>ID</th>
        <th>Title</th>
        <th>Status</th>
        <th>Updated</th>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>{{ item.id }}</td>
          <td>
            <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
          </td>
          <td>
          </td>
          <td>
          </td>
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
