<template>
  <div id="tab-description">
    <textarea v-model="item.description" class="textarea" placeholder="Description"></textarea>
  </div>
</template>
<script>
export default {
  props: ['item']
}
</script>
