<template>
  <div>
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
          <button @click="save" class="button is-primary is-small">
            Save
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
        <label class="label">Question</label>
      </div>
      <div class="field-body">
        <div class="field">
          <div class="control">
            <textarea class="textarea" placeholder="Explain how we can help you"></textarea>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
    }
  },
  computed: {
    item() {
      return this.$store.state.items[this.$route.params.id]
    }
  },
  asyncData ({ store, route: { params: { id } } }) {
    return store.dispatch('fetchItems', { _id: parseInt(id) })
  },
  methods: {
    save () {
      this.$store.dispatch('saveItem', this.item).then(
        r => {
          
        },
        e => {
          
        }
      )
    }
  }
}
</script>
