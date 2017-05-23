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
          {{ $store.state.user.username }}
        </div>
        <div class="nav-item">
          <a class="button is-small" href="/logout">Logout</a>
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
  methods: {
    toggle () {
      this.toggleActive = !this.toggleActive
console.log('toggle: ' + this.toggleActive)
    }
  }
}
</script>
