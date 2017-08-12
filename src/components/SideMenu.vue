<template>
  <aside class="menu">
    <p class="menu-label">
      <span class="icon is-small">
        <i class="fa fa-list" aria-hidden="true"></i>
      </span>
      ITEMS
    </p>
    <ul class="menu-list">
      <li v-for="filters in $store.state.filters.item">
        <router-link :to="'/items/' + filters.name">
          {{ filters.name }}
        </router-link>
      </li>
      <li>
        <hr/>
      </li>
      <p class="menu-label">
        <span class="icon is-small">
          <i class="fa fa-cogs" aria-hidden="true"></i>
        </span>
        TOOLS
      </p>
      <li>
        <router-link to="/items/trash">
          Import
        </router-link>
      </li>
      <li>
        <router-link to="/items/trash">
          Export
        </router-link>
      </li>
    </ul>
  </aside>
</template>
