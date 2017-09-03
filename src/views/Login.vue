<template>
  <div class="columns is-vcentered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <form method="post" action="/auth/local/login">
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
              <router-link to="/" class="button">Cancel</router-link>
            </p>
          </div>
        </form>
        <a href="/auth/google">Sign in with Google</a>
        <a href="/auth/auth0">Sign in with Auth0</a>
      </div>
    </div>
  </div>
</template>
