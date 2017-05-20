<template>
  <div id="detail">
    <h3>Detail</h3>
    <form @submit.prevent="save">
      Title: <input v-model="title" type="text" name="title">
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      title: ''
    }
  },
  methods: {
    save () {
      this.$store.dispatch('save', { title: this.title }).then(
        r => {
          
        },
        e => {
          
        }
      )
    }
  }
}
</script>
