<template>
  <nav class="nav has-shadow">
    <div class="nav-left">
      <router-link class="nav-item" to="/">Logo</router-link>
    </div>
    <span class="nav-toggle" @click="toggle">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <div class="nav-right nav-menu" v-bind:class="{ 'is-active': toggleActive }">
      <a class="nav-item">Features</a>
      <a class="nav-item">Blog</a>
      <a class="nav-item">Help</a>
      <div class="nav-item">
        <div class="field is-grouped">
          <p class="control">
            <router-link class="button is-small" to="/signup">Sign up</router-link>
          </p>
          <p class="control">
            <router-link class="button is-small is-info" to="/login">Login</router-link>
          </p>
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
