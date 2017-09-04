<template>
  <div id="app">
    <div class="columns">
      <div class="column">
        <Navbar v-if="$store.state.user"/>
        <NavbarGuest v-else/>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './views/Navbar.vue'
import NavbarGuest from './views/NavbarGuest.vue'

export default {
  components: {
    Navbar: Navbar,
    NavbarGuest: NavbarGuest
  }
}
</script>

<style lang="sass">
  @import "~bulma/sass/utilities/initial-variables.sass"
  $navbar-background-color: $white-bis
  $link: $blue
  @import "~bulma/bulma.sass"
</style>
