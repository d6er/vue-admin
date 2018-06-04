<template>
  <div class="container is-fluid">
    <div class="columns is-mobile">
      <div v-if="$store.state.user" class="column is-narrow"
           :class="{ 'is-hidden-mobile': !$store.state.isNavBarActive }">
        <aside class="menu">
          <button class="button is-small is-fullwidth">
            <span class="icon is-small">
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </span>
            <span>Create</span>
          </button>
          <p class="menu-label">
            <span class="icon is-small">
              <i class="fa fa-list" aria-hidden="true"></i>
            </span>
            {{ $route.params.list }}
          </p>
          <FilterTree/>
        </aside>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import FilterTree from './FilterTree.vue'

export default {
  components: {
    FilterTree: FilterTree
  }
}

</script>
