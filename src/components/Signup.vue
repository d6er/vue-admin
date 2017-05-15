<template>
  <div>
    Sign up
    
    <div>
      <form method="post" action="/signup">
        <label><input placeholder="email" type="text" name="email"></label>
        <label><input placeholder="password" type="password" name="password"></label>
        <button type="submit">Login with Express</button>
      </form>
      <button @click="signup">Sign up</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    signup () {
      this.$store.dispatch('signUp')
    }
  }
}
</script>
