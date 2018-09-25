<template>
  <td :class="{ 'is-hidden-mobile': column != 'subject' }">
    <template v-if="column == 'picture'">
      <figure class="image is-32x32">
        <img src="http://bulma.io/images/placeholders/32x32.png">
      </figure>
    </template>
    <template v-else-if="column == 'subject'">
      <router-link :to="getDetailLinkURL(item._id)">
        {{ item[column] }}
      </router-link>
    </template>
    <template v-else-if="column == 'mimeType'">
      {{ item.payload.mimeType }}
    </template>
    <template v-else-if="column == 'labelIds'">
      <div class="tags">
        <span v-for="labelId in item.labelIds" class="tag">
          {{ labelId }}
        </span>
      </div>
    </template>
    <template v-else>
      {{ item[column] }}
    </template>
  </td>
</template>
<script>
export default {
  props: [ 'item', 'column' ],
  methods: {
    getDetailLinkURL(_id) {
      return '/' + this.$route.params.list + '/' + this.$route.params.filter + '/' + _id + '/detail'
    }
  }
}
</script>
