<template>
  <div>
    Login
    
    <div>
      <form method="post" action="/login">
        <label><input placeholder="username" type="text" name="username"></label>
        <label><input placeholder="password" type="password" name="password"></label>
        <button type="submit">Login with Express</button>
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
