<template>
  <div class="columns is-vcentered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <form @submit.prevent="signup">
          <div class="field">
            <label class="label">Username:</label>
            <p class="control">
              <input v-model="username" class="input" placeholder="Username" type="text">
            </p>
          </div>
          <div class="field">
            <label class="label">Password:</label>
            <p class="control">
              <input v-model="password" class="input" placeholder="Password" type="password">
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
      
      let payload = {
        username: this.username,
        password: this.password
      }
      
      this.$store.dispatch('createAccount', payload).then(
        response => {
          console.dir(response)
          // todo: auto login
        },
        error => {
          console.log('signup error')
          // todo: show message to user
        }
      )
    }
  }
}
</script>
