<template>
  <div>
    <div id="tab-description">
      test content<br/>
      test content<br/>
      test content<br/>
      test content<br/>
      <!--vue-editor></vue-editor-->
    </div>
  </div>
</template>
<script>
//import { VueEditor } from 'vue2-editor'
import Quill from 'quill'

export default {
  props: ['item'],
  components: {
   // VueEditor
  },
  mounted () {
    if (window) {
      new Quill('#tab-description', {
        theme: 'snow'
      })
    }
  }
}
</script>
