<template>
  <div>
    <div class="columns">
      <div class="column">
      </div>
    </div>
    <div class="container">
      <div class="columns is-vcentered has-text-centered">
        <div class="column is-5">
          <figure class="image is-4by3">
            <img src="http://placehold.it/800x600" alt="Description">
          </figure>
        </div>
        <div class="column is-6 is-offset-1">
          <h1 class="title is-2">Admin Dashboard</h1>
          <h2 class="subtitle is-4">This is an example application.</h2>
        </div>
      </div>
    </div>
    <div class="modal" v-bind:class="{ 'is-active': loginModal }">
      <div class="modal-background" @click="cancelLogin"></div>
      <div class="modal-content">
        <div class="box">
          <form method="post" action="/login">
            <div class="field">
              <label class="label">Username:</label>
              <p class="control">
                <input class="input" placeholder="Username" type="text" name="username">
              </p>
            </div>
            <div class="field">
              <label class="label">Password:</label>
              <p class="control">
                <input class="input" placeholder="Password" type="password" name="password">
              </p>
            </div>
            <div class="field is-grouped">
              <p class="control">
                <button type="submit" class="button is-primary">Login</button>
              </p>
              <p class="control">
                <a class="button is-link" @click="cancelLogin">Cancel</a>
              </p>
            </div>
          </form>
        </div>
      </div>
      <button class="modal-close" @click="cancelLogin"></button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginModal: false,
      toggleActive: false
    }
  },
  methods: {
    login () {
      this.loginModal = true
    },
    cancelLogin () {
      this.loginModal = false
    },
    toggle () {
      this.toggleActive = !this.toggleActive
    }
  }
}
</script>
