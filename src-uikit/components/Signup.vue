<template>
  <div class="columns is-vcentered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <form @submit.prevent="signup">
          <div class="field">
            <label class="label">Username:</label>
            <p class="control">
              <input class="input" placeholder="Username" type="text" name="username" v-model="username">
            </p>
          </div>
          <div class="field">
            <label class="label">Password:</label>
            <p class="control">
              <input class="input" placeholder="Password" type="password" name="password" v-mode="password">
            </p>
          </div>
          <div class="field is-grouped">
            <p class="control">
              <button type="submit" class="button is-primary">Sign up</button>
            </p>
            <p class="control">
              <router-link to="/" class="button">Cancel</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    // http://stackoverflow.com/questions/40165766/returning-promises-from-vuex-actions
    signup () {
      this.$store.dispatch('create_account', { username: this.username, password: this.password })
        .then(
          response => {
            console.dir(response)
            // todo: auto login
          },
          error => {
            console.log('signup: ' + error.message)
            // todo: show message to user
          }
        )
    }
  }
}
</script>
