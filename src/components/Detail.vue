<template>
  <div>
    <h1 class="title is-4">{{ item.title }}</h1>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <router-link to="/list" class="button is-small">
            <span class="icon">
              <i class="fa fa-angle-left" aria-hidden="true"></i>
            </span>
          </router-link>
        </div>
        <div class="level-item">
          <button @click="save" class="button is-info is-small">
            <span class="icon is-small">
              <i class="fa fa-save" aria-hidden="true"></i>
            </span>
            <span>Save</span>
          </button>
        </div>
        <div class="level-item">
          <button class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-files-o" aria-hidden="true"></i>
            </span>
            <span>Copy</span>
          </button>
        </div>
        <div class="level-item">
          <button class="button is-small">
            <span class="icon is-small">
              <i class="fa fa-times" aria-hidden="true"></i>
            </span>
            <span>Delete</span>
          </button>
        </div>
      </div>
    </nav>
    <div class="tabs">
      <ul>
        <li class="is-active">
          <a>
            <span class="icon is-small"><i class="fa fa-image"></i></span>
            <span>Detail</span>
          </a>
        </li>
        <li><a>Picture</a></li>
        <li><a>Shipping</a></li>
      </ul>
    </div>
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">Title</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control">
            <input v-model="item.title" type="text" name="title" class="input">
          </p>
        </div>
      </div>
    </div>
    
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Status</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="item.status">
                <option>Draft</option>
                <option>Published</option>
                <option>Unpublished</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="field is-horizontal">
      <div class="field-label">
        <label class="label">No padding</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox">
              Checkbox
            </label>
          </div>
        </div>
      </div>
    </div>
    
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Description</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea v-model="item.description" class="textarea" placeholder="Description"></textarea>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  // https://github.com/vuejs/vue/issues/1056
  // https://forum.vuejs.org/t/vuex-v-model-on-property-in-nested-object/6242/2
  computed: {
    item () {
      if (this.$route.params.id == 'new') {
        return {}
      } else {
        // POINT: disconnect item from vuex
        return Object.assign({}, this.$store.state.items[this.$route.params.id])
      }
    }
  },
  asyncData ({ store, route: { params: { id } } }) {
    if (id != 'new') {
      return store.dispatch('callApi', { action: 'fetchItem', item_id: parseInt(id) })
    }
  },
  methods: {
    save () {
      this.$store.dispatch('callApi', { action: 'saveItem', item: this.item }).then(
        r => {
          this.$router.push('/list')
        },
        e => {
          console.dir(e)
        }
      )
    }
  }
}
</script>
