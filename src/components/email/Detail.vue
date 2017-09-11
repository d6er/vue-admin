<template>
  <div id="tab-detail">
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Subject</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            {{ item.subject }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['item']
}
</script>
