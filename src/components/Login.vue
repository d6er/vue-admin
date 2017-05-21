<template>
  <div>
    <h3>Login</h3>
    
    <div>
      <form method="post" action="/login">
        <input type="text" name="redirect" :value="$route.query.redirect">
        <label>
          Username:
          <input placeholder="username" type="text" name="username">
        </label>
        <label>
          Password:
          <input placeholder="password" type="password" name="password">
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
    
    <div>
      <a href="/auth/google">/auth/google</a>
    </div>
    <div>
      <a href="/auth/auth0">/auth/auth0</a>
    </div>
  </div>
</template>
