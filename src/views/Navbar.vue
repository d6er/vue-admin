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
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <router-link class="button is-small" to="/user">
            <span class="icon is-small">
              <i class="fa fa-user" aria-hidden="true"></i>
            </span>
            <span>{{ username }}</span>
          </router-link>
        </div>
        <div class="navbar-item">
          <a class="button is-small" href="/auth/local/logout">
            <span class="icon is-small">
              <i class="fa fa-sign-out" aria-hidden="true"></i>
            </span>
            <span>Logout</span>
          </a>
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
