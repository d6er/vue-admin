<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <div class="navbar-burger" style="margin-left: 0;" @click="toggleNavBar()"
           :class="{ 'is-active': $store.state.isNavBarActive }">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="navbar-item" v-if="notification">
        <span class="tag is-dark">{{ notification }}</span>
      </div>
    </div>
    <div class="navbar-menu"
         :class="{ 'is-active': $store.state.isNavBarActive }">
      <div class="navbar-start">
        <router-link class="navbar-item" to="/">
          Home
        </router-link>
        <router-link v-for="list in $store.state.lists" :key="list.name" :to="'/' + list.name"
                     class="navbar-item is-tab is-capitalized">
          {{ list.name }}
        </router-link>
      </div>
      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link is-small">
            {{ username }}
          </a>
          <div class="navbar-dropdown">
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
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    username () {
      if (this.$store.state.user.google) {
        return this.$store.state.user.google.displayName
      } else {
        return this.$store.state.user.username
      }
    },
    notification () {
      return this.$store.state.notification
    }
  },
  methods: {
    toggleNavBar () {
      this.$store.commit('toggleNavBar')
    },
    clearNotification () {
      this.$store.commit('clearNotification')
    }
  }
}
</script>
