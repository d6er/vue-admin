<template>
  <div>
    <h3>Sign up</h3>
    
    <div>
      <form @submit.prevent="signup">
        <label>
          <input v-model="username" placeholder="email" type="text" name="username">
        </label>
        <label>
          <input v-model="password" placeholder="password" type="password" name="password">
        </label>
        <button type="submit">Sign up</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // http://stackoverflow.com/questions/40165766/returning-promises-from-vuex-actions
    signup () {
      this.$store.dispatch('signup', { username: this.username, password: this.password })
        .then(response => {
          console.log('Signup.vue signup(): ' + response.message)
        }, error => {
          
        })
    }
  }
}
</script>
