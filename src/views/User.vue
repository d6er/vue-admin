<template>
  <div>
    <h1 class="title is-5">Settings</h1>
    <hr/>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Username</label>
      </div>
      <div class="field-body">
        <div class="field">
          {{ username }}
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Time zone</label>
      </div>
      <div class="field-body">
        <div class="field">
          {{ timezone }}
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Accounts</label>
      </div>
      <div class="field-body">
        <a href="/auth/google">Add a Google account</a>
      </div>
    </div>
    <hr/>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Delete account</label>
      </div>
      <div class="field-body">
        <div class="field">
          <button @click="deleteAccount" class="button is-danger">Delete account</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment-timezone'

export default {
  
  computed: {
    username () {
      if (this.$store.state.user.google) {
        return this.$store.state.user.google.displayName
      } else {
        return this.$store.state.user.username
      }
    },
    timezone () {
      return moment.tz.guess()
    }
  },
  
  methods: {
    deleteAccount () {
      this.$store.dispatch('deleteAccount').then(
        r => {
          // todo: go to home page
        },
        e => {
          
        }
      )
    }
  }
}
</script>
