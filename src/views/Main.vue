<template>
  <div>
    <div class="columns">
      <div class="column">
        <Navbar v-if="$store.state.user"/>
        <NavbarGuest v-else/>
      </div>
    </div>
    <div class="container is-fluid">
      <div class="columns">
        <div v-if="$store.state.user" class="column is-narrow">
          <aside class="menu">
            <p class="menu-label">
              <span class="icon is-small">
                <i class="fa fa-list" aria-hidden="true"></i>
              </span>
              {{ $route.params.list }}
            </p>
            <SideMenuList parent="" :parentPath="'/' + $route.params.list" depth="0"/>
          </aside>
        </div>
        <div class="column">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue'
import NavbarGuest from './NavbarGuest.vue'
import SideMenuList from './SideMenuList.vue'

export default {
  components: {
    Navbar: Navbar,
    NavbarGuest: NavbarGuest,
    SideMenuList: SideMenuList
  }
}

</script>
