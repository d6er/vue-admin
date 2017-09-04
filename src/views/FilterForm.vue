<template>
  <div class="box" id="filterFormBox">
    <div class="columns">
      <div class="column is-narrow">
        <div class="field">
          <label class="label">Filter name</label>
          <div class="control">
            <input class="input is-small" type="text" v-model="filter.name">
          </div>
        </div>
        <div class="field">
          <label class="label">Parent filter</label>
          <div class="control">
            <span class="select is-small">
              <select v-model="filter.parent">
                <option value="">(none)</option>
                <option>account</option>
                <option>status</option>
              </select>
            </span>
          </div>
        </div>
        <div class="field">
          <label class="label">Apply to each</label>
          <div class="control">
            <span class="select is-small">
              <select v-model="filter.foreach">
                <option value="">(none)</option>
                <option>account</option>
                <option>status</option>
              </select>
            </span>
          </div>
        </div>
      </div>
      <div class="column field is-narrow">
        <label class="label">Queries</label>
        <div class="field has-addons" v-for="(q, idx) in filter.queries">
          <p class="control">
            <span class="select is-small">
              <select v-model="q.field">
                <option value="" disabled hidden>(field)</option>
                <option v-for="field in $store.state.fields.item">
                  {{ field.name }}
                </option>
              </select>
            </span>
          </p>
          <p class="control">
            <span class="select is-small">
              <select v-model="q.condition">
                <option value="" disabled hidden>(condition)</option>
                <option>is equal to</option>
                <option>is not equal to</option>
                <option>contains</option>
                <option>does not contain</option>
              </select>
            </span>
          </p>
          <p class="control">
            <input v-model="q.value" class="input is-small" type="text" placeholder="Keyword">
          </p>
          <p class="control">
            <button @click="deleteQuery(idx)" class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a @click="addQuery" class="button is-link is-small">Add query</a>
      </div>
      <div class="column field is-narrow">
        <label class="label">Sorting</label>
        <div class="field has-addons" v-for="(s, idx) in filter.sorting">
          <p class="control">
            <span class="select is-small">
              <select v-model="s.field">
                <option value="" disabled hidden>(field)</option>
                <option v-for="field in $store.state.fields.item">
                  {{ field.name }}
                </option>
              </select>
            </span>
          </p>
          <p class="control">
            <span class="select is-small">
              <select v-model="s.order">
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </span>
          </p>
          <p class="control">
            <button @click="deleteSorting(idx)" class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a @click="addSorting" class="button is-link is-small">Add sorting</a>
      </div>
      <div class="column field is-narrow">
        <label class="label">Columns</label>
        <div class="field has-addons" v-for="(c, idx) in filter.columns">
          <p class="control">
            <span class="select is-small">
              <select v-model="filter.columns[idx]">
                <option value="" disabled hidden>(field)</option>
                <option v-for="field in $store.state.fields.item">
                  {{ field.name }}
                </option>
              </select>
            </span>
          </p>
          <p class="control">
            <button class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-arrow-up" aria-hidden="true"></i>
              </span>
            </button>
          </p>
          <p class="control">
            <button class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-arrow-down" aria-hidden="true"></i>
              </span>
            </button>
          </p>
          <p class="control">
            <button @click="deleteColumn(idx)"class="button is-small">
              <span class="icon is-small">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </button>
          </p>
        </div>
        <a @click="addColumn" class="button is-link is-small">Add column</a>
        
      </div>
    </div>
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <button @click="saveFilter" class="button is-info is-small">
            <span class="icon is-small">
              <i class="fa fa-save" aria-hidden="true"></i>
            </span>
            <span>Save</span>
          </button>
        </div>
        <div class="level-item">
          <button class="button is-light is-small">
            <span>Cancel</span>
          </button>
        </div>
        <div class="level-item">
          <button @click="deleteFilter" class="button is-link is-small">
            Delete this filter
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: ['filter'],
  methods: {
    saveFilter() {
    },
    deleteFilter() {
    },
    addQuery() {
      const idx = this.filter.queries.length
      this.$set(this.filter.queries, idx, { field: '', condition: '', value: '' })
    },
    addSorting() {
      const idx = this.filter.sorting.length
      this.$set(this.filter.sorting, idx, { field: '', order: 'asc' })
    },
    addColumn() {
      const idx = this.filter.columns.length
      this.$set(this.filter.columns, idx, '')
    },
    deleteQuery(idx) {
      this.$delete(this.filter.queries, idx)
    },
    deleteSorting(idx) {
      this.$delete(this.filter.sorting, idx)
    },
    deleteColumn(idx) {
      this.$delete(this.filter.columns, idx)
    }
  }
}
</script>
