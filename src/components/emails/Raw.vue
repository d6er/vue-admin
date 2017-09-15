<template>
  <div id="tab-raw" class="columns">
    <div class="column is-12">
      <pre>{{ item }}</pre>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item']
}
</script>
