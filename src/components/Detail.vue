<template>
  <div id="detail">
    
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
    
    <form @submit.prevent="save">
      <div class="field is-horizontal">
        <div class="field-label">
          <label class="label">Title</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <input v-model="title" type="text" name="title" class="input">
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

      <div class="field is-grouped">
        <div class="field-label">
          <!-- Left empty for spacing -->
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control">
              <button type="submit" class="button is-primary">
                Save
              </button>
            </p>
            <p class="control">
              <a class="button">
                Cancel
              </a>
            </p>
          </div>
        </div>
      </div>
      
    </form>
    
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      title: ''
    }
  },
  methods: {
    save () {
      this.$store.dispatch('save', { title: this.title }).then(
        r => {
          
        },
        e => {
          
        }
      )
    }
  }
}
</script>
