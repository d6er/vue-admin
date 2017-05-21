<template>
  <div id="list">
    <table class="table is-narrow">
      <thead>
        <th>ID</th>
        <th>Img</th>
        <th>Title</th>
        <th>Status</th>
        <th>Updated</th>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>
            <input type="checkbox">
          </td>
          <td>
            <figure class="image is-32x32">
              <img src="http://bulma.io/images/placeholders/32x32.png">
            </figure>
          </td>
          <td>
            <router-link :to="'/item/' + item.id">{{ item.title }}</router-link>
            <span class="tag is-dark">active</span>
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
