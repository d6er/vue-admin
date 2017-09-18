<template>
  <div id="tab-detail">
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Tags</label>
      </div>
      <div class="field-body">
        <div class="field tags">
          <span class="tag" v-for="labelId in item.labelIds">
            {{ labelId }}
          </span>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Subject</label>
      </div>
      <div class="field-body">
        <div class="field">
          {{ item.subject }}
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">From</label>
      </div>
      <div class="field-body">
        <div class="field">
          {{ item.from }}
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">To</label>
      </div>
      <div class="field-body">
        <div class="field">
          {{ item.to }}
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Date</label>
      </div>
      <div class="field-body">
        <div class="field">
          {{ item.date }}
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Body</label>
      </div>
      <div class="field-body">
        <div class="field">
          {{ item.snippet }}
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
