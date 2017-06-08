<template>
  <div id="tab-description">
    <div id="editor" v-html="item.description">
    </div>
  </div>
</template>
<script>
import Quill from 'quill'

export default {
  props: ['item'],
  mounted () {
    if (window) {
      const quill = new Quill('#editor', { theme: 'snow' })
      quill.on('text-change', () => {
        this.item.description = document.querySelector('#editor .ql-editor').innerHTML
      })
    }
  }
}
</script>
