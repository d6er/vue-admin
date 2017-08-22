<template>
  <div>
    <List v-if="!$route.query.id"/>
    <Detail v-if="$route.query.id"/>
  </div>
</template>

<script>
import List from './List.vue'
import Detail from './Detail.vue'

export default {
  components: {
    List: List,
    Detail: Detail
  },
}
</script>
