<template>
  <nav class="nav has-shadow">
      <div class="nav-left" v-if="!$store.state.user">
        <router-link class="nav-item is-tab" to="/">Home</router-link>
      </div>
      <div class="nav-left" v-if="$store.state.user">
        <router-link class="nav-item is-tab" to="/">Overview</router-link>
        <router-link class="nav-item is-tab" to="/list">Orders</router-link>
        <router-link class="nav-item is-tab" to="/list">Listings</router-link>
        <router-link class="nav-item is-tab" to="/list">Messages</router-link>
      </div>
      <div class="nav-right nav-menu">
        <a class="nav-item">
          Features
        </a>
        <a class="nav-item">
          Blog
        </a>
        <a class="nav-item">
          Help
        </a>
        <div class="nav-item" v-if="$store.state.user">
          {{ $store.state.user.username }}
        </div>
        <div class="nav-item" v-if="$store.state.user">
          <a class="button is-small" href="/logout">Logout</a>
        </div>
        <div class="nav-item" v-if="!$store.state.user">
          <div class="field is-grouped">
            <p class="control">
              <router-link class="button is-small" to="/login">
                Login
              </router-link>
            </p>
            <p class="control">
              <router-link class="button is-small is-info" to="/signup">
                Sign up
              </router-link>
            </p>
          </div>
        </div>
    </div>
  </nav>
</template>
