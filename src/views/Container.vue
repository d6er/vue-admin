<template>
  <div class="container is-fluid">
    <div class="columns">
      <div v-if="$store.state.user" class="column is-narrow"
           :class="{ 'is-hidden-mobile': !$store.state.isNavBarActive }">
        
        <div class="dropdown"
             :class="{ 'is-active': $store.state.isDropdownActive }">
          <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu"
                    @click="toggleDropdown()">
              <span class="is-capitalized">{{ $route.params.list }}</span>
              <span class="icon is-small">
                <i class="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="dropdown-menu" role="menu">
            <div class="dropdown-content">
              <router-link v-for="list in $store.state.lists"
                           :key="list.name" :to="'/' + list.name"
                           class="navbar-item is-capitalized">
                {{ list.name }}
              </router-link>
              
              <hr class="dropdown-divider">
              
              <router-link class="navbar-item" to="/settings">
                <span class="icon is-small">
                  <i class="fa fa-cogs" aria-hidden="true"></i>
                </span>
                Settings
              </router-link>
              <a class="navbar-item" href="/auth/local/logout">
                <span class="icon is-small">
                  <i class="fa fa-sign-out" aria-hidden="true"></i>
                </span>
                Logout
              </a>
            </div>
          </div>
        </div>

        <button class="button is-fullwidth">
          <span class="icon is-small">
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          </span>
          <span>Create</span>
        </button>
        
        <aside class="menu">
          <FilterTree/>
        </aside>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import FilterTree from './FilterTree.vue'

export default {
  components: {
    FilterTree: FilterTree
  },
  methods: {
    toggleDropdown () {
      this.$store.commit('toggleDropdown')
    }
  }
}

</script>
