<template>
  <nav class="nav has-shadow">
    <div class="container is-fluid">
      <div class="nav-left nav-menu" v-bind:class="{ 'is-active': toggleActive }">
        <router-link class="nav-item" to="/">Overview</router-link>
        <router-link class="nav-item is-tab" to="/list">Items</router-link>
        <router-link class="nav-item is-tab" to="/list">Todos</router-link>
        <router-link class="nav-item is-tab" to="/list">Messages</router-link>
      </div>
      <span class="nav-toggle" @click="toggle">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <div class="nav-right nav-menu" v-bind:class="{ 'is-active': toggleActive }">
        <div class="nav-item">
          <router-link class="button is-small" to="/user">
            <span class="icon is-small">
              <i class="fa fa-user" aria-hidden="true"></i>
            </span>
            <span>{{ username }}</span>
          </router-link>
        </div>
        <div class="nav-item">
          <a class="button is-small" href="/logout">
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
    }
  },
  methods: {
    toggle () {
      this.toggleActive = !this.toggleActive
console.log('toggle: ' + this.toggleActive)
    }
  }
}
</script>
