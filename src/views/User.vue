<template>
  <div>
    <div class="columns">
      <div class="column">
        <Navbar/>
      </div>
    </div>
    <div class="container is-fluid">
      <div class="columns">
        <div class="column is-narrow">
          <aside class="menu">
            <p class="menu-label">
              User Setting
            </p>
          </aside>
        </div>
        <div class="column">
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
              <table class="table is-narrow">
                <thead>
                  <th>Account type</th>
                  <th>Name</th>
                  <th>Time</th>
                </thead>
                <tbody>
                  <tr v-for="account in $store.state.user.accounts">
                    <td>
                      {{ account.provider }}
                    </td>
                    <td>
                      {{ account.displayName }}
                    </td>
                    <td>
                    </td>
                  </tr>
                </tbody>
              </table>
              <hr/>
              <a href="/auth/google">Add a Google account</a>
              <a href="/auth/auth0">Add an Auth0 account</a>
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
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from './Navbar.vue'
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
  },

  components: {
    Navbar: Navbar
  }
}
</script>
