<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        Home
      </router-link>
      <div class="navbar-burger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <router-link v-for="list in $store.state.lists" :key="list.name" :to="'/' + list.name"
                     class="navbar-item is-tab is-capitalized">
          {{ list.name }}
        </router-link>
        <div class="navbar-item" v-if="notification">
          <span class="tag is-dark is-rounded">{{ notification }}</span>
        </div>
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
  data () {
    return {
      toggleActive: false
    }
  },
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
    toggle () {
      this.toggleActive = !this.toggleActive
      console.log('toggle: ' + this.toggleActive)
    },
    clearNotification () {
      this.$store.commit('clearNotification')
    }
  }
}
</script>
