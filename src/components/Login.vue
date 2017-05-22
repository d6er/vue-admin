<template>
  <div class="columns is-vcentered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <form method="post" action="/login">
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
      </div>
    </div>
  </div>
</template>
