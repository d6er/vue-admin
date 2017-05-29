<template>
  <div>
    <h1 class="title is-4">Settings</h1>
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
          <select>
          </select>
        </div>
      </div>
    </div>
    <hr/>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Delete account</label>
      </div>
      <div class="field-body">
        <div class="field">
          <button class="button is-danger">Delete account</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    username () {
      if (this.$store.state.user.google) {
        return this.$store.state.user.google.displayName
      } else {
        return this.$store.state.user.username
      }
    }
  }
}
</script>
