<template>
  <div id="app">
    <router-link to="/">Home</router-link>
    |
    <router-link to="/list">List</router-link>
    <router-link to="/detail">Detail</router-link>
    |
    <router-link to="/signup">Sign up</router-link>
    <router-link to="/login">Login</router-link>
    <a href="/logout">Logout</a>
    <hr/>
    sid: {{ $store.state.sid }}
    <hr/>
    
    <router-view></router-view>
    
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      ws: null
    }
  },
  created () {
    if (typeof window !== 'undefined') {
      //this.ws = new WebSocket(`ws://localhost:8181`)
    }
  }
}
</script>

<style>
#app {
  font-face: verdana;
}
</style>
