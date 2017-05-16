<template>
  <div>
    Sign up
    
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
    signup () {
      this.$store.dispatch('signUp', { username: this.username, password: this.password })
    }
  }
}
</script>
