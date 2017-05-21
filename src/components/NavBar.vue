<template>
  <nav class="nav has-shadow">
    <div class="container">
      <div class="nav-left">
        <router-link class="nav-item" to="/">Home</router-link>
        <router-link class="nav-item" to="/list">List</router-link>
        <router-link class="nav-item" to="/detail">Detail</router-link>
      </div>
      <div class="nav-right">
        <div class="nav-item">
          {{ $store.state.user ? $store.state.user.username : '' }}
        </div>
        <router-link class="nav-item" to="/login">Login</router-link>
        <router-link class="nav-item" to="/signup">Sign up</router-link>
        <a class="nav-item" href="/logout">Logout</a>
      </div>
    </div>
  </nav>
</template>
