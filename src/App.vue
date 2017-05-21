<template>
  <section id="app">
    <div class="columns">
      <div class="column">
        <nav-bar></nav-bar>
      </div>
    </div>
    <div class="container">
      <div class="columns">
        <div class="column is-2" v-if="$store.state.user">
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
  data () {
    return {
      loggedIn: this.$store.state.user
    }
  },
  components: {
    NavBar,
    SideMenu
  }
}
</script>
