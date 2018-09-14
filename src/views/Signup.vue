<template>
  <div class="columns is-vcentered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <form method="post" action="/auth/local/login" @submit="signup">
          <div class="field">
            <label class="label">Username:</label>
            <p class="control">
              <input v-model="username" class="input" placeholder="Username" type="text" name="username">
            </p>
          </div>
          <div class="field">
            <label class="label">Password:</label>
            <p class="control">
              <input v-model="password" class="input" placeholder="Password" type="password" name="password">
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
      
      let data = {
        action: 'createUser',
        username: this.username,
        password: this.password
      }
      
      return this.$store.dispatch('callApi', data).then(r => {
        
        let apiData = { action: 'copyDefaultFilter' }
        return this.$store.dispatch('callApi', apiData)
        
      }).then(r => {
        
        // todo: auto login
        console.dir(response)
        
        return
        
      }).catch(error => {
        
        // todo: show message to user
        console.log('signup error')
        console.dir(error)
        
      })
    }
  }
}
</script>
