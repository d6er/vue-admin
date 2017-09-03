<template>
  <div>
    <div class="columns">
      <div class="column">
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
  </div>
</template>
