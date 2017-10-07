<template>
  <td>
    <template v-if="column == 'picture'">
      <figure class="image is-32x32">
        <img src="http://bulma.io/images/placeholders/32x32.png">
      </figure>
    </template>
    <template v-else-if="isLinkToDetail(column)">
      <router-link :to="getDetailLinkURL(item._id)">
        {{ getFieldValue(item, column) }}
      </router-link>
    </template>
    <template v-else>
      {{ getFieldValue(item, column) }}
    </template>
  </td>
</template>
<script>
export default {
  props: [ 'item', 'column' ],
  
  methods: {
    isLinkToDetail(fieldName) {
      let field = this.$store.state.currentList.fields.find(f => f.name == fieldName)
      return field.linkToDetail
    },
    
    getDetailLinkURL(_id) {
      return '/' + this.$route.params.list + '/' + this.$route.params.filter + '/' + _id + '/detail'
    },
    
    getFieldValue(item, fieldName) {
      let field = this.$store.state.currentList.fields.find(f => f.name == fieldName)
      if (field.field) {
        let arr = field.field.split('.')
        let obj = item[arr[0]]
        for (let i = 1; i < arr.length; i++) {
          obj = obj[arr[i]]
        }
        return obj
      } else {
        return item[fieldName]
      }
    }
  }
}
</script>
