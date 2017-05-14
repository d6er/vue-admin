<template>
  <div>
    Login
    <!--form @submit.prevent="login"-->
    <form method="post" action="/login">
      <label><input placeholder="username" type="text" name="username"></label>
      <label><input placeholder="password" type="password" name="password"></label>
      <button type="submit">Login with Express</button>
    </form>
  
    <form @submit.prevent="login">
      <label><input placeholder="username" type="text" name="username"></label>
      <label><input placeholder="password" type="password" name="password"></label>
      <button type="submit">Login with Auth0</button>
    </form>

    <button @click="loginGoogle">Login with Google</button>
    
    <a href="/auth/google">/auth/google</a>
  </div>
</template>

<script>
import auth0 from '../auth0'

export default {
  methods: {
    login() {
      
      auth0.redirect.loginWithCredentials({
        connection: 'Username-Password-Authentication',
        username: 'd6er@qq.com',
        password: 'lzF2p456',
        responseType: 'code', // 'token id_token', 'token'
      });
      
      //this.$store.commit('login')
      //this.$router.replace(this.$route.query.redirect)
    },
    
    loginGoogle() {
      auth0.authorize({
        connection: 'google-oauth2',
        responseType: 'token id_token'
      });
    }
  }
}
</script>
