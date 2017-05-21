<template>
  <section id="app">
    <div class="columns">
      <div class="column">
        <nav-bar></nav-bar>
      </div>
    </div>
    <div class="container">
      <div class="columns">
      <div class="column is-2">
        <side-menu></side-menu>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
    </div>
  </section>
</template>

<script>
import NavBar from './components/NavBar.vue'
import SideMenu from './components/SideMenu.vue'

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
  },
  components: {
    NavBar,
    SideMenu
  }
}
</script>

<style>
#app {
  font-face: verdana;
}
</style>
