<template>
  <nav class="uk-navbar-container" uk-navbar>
    <div class="uk-navbar-left">
      <ul class="uk-navbar-nav">
        <li><router-link class="nav-item" to="/">Overview</router-link></li>
        <li><router-link class="nav-item is-tab" to="/list">Items</router-link></li>
        <li><router-link class="nav-item is-tab" to="/list">Todos</router-link></li>
        <li><router-link class="nav-item is-tab" to="/list">Messages</router-link></li>
      </ul>
      </div>
      <div class="uk-navbar-right">
        <ul class="uk-navbar-nav">
          <li class="nav-item">
            <a class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-user" aria-hidden="true"></i>
              </span>
              <span>{{ $store.state.user.username }}</span>
            </a>
          </li>
          <li>
            <a class="button is-small" href="/logout">
              <span class="icon is-small">
                <i class="fa fa-sign-out" aria-hidden="true"></i>
              </span>
              <span>Logout</span>
            </a>
          </li>
        </ul>
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
