<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link class="navbar-item" to="/">
        Home
      </router-link>
      <div class="navbar-burger">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <a class="nav-item">Features</a>
        <a class="nav-item">Blog</a>
        <a class="nav-item">Help</a>
      </div>
      <div class="navbar-end">
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
    </div>
  </nav>
</template>
