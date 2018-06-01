<template>
  <div id="app">
    <Navbar v-if="$store.state.user"/>
    <NavbarGuest v-else/>
    <section class="section">
      <router-view></router-view>
    </section>
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

  $section-padding: 1.5rem 1.5rem
  $section-padding-medium: 1.5rem 1.5rem
  $section-padding-large: 1.5rem 1.5rem

  @import "~bulma/bulma.sass"
</style>
