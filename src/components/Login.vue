<template>
  
  <div>
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">

        <div class="box">
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
        
      </div>
    </div>
    
  </div>
</template>
