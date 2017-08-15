<template>
  <aside class="menu">
    
    <p class="menu-label">
      <span class="icon is-small">
        <i class="fa fa-list" aria-hidden="true"></i>
      </span>
      ITEMS
    </p>
    
    <ul class="menu-list">
      <template v-for="filters in $store.state.filters.item">
        <li v-if="filters.foreach != ''" v-for="elm in $store.state[filters.foreach]">
          <router-link :to="'/items/' + filters.name + '/' + elm">
            {{ elm }}
          </router-link>
        </li>
        <li v-if="!filters.foreach">
          <router-link :to="'/items/' + filters.name">
            {{ filters.name }}
          </router-link>
          <ul v-if="filters.name == 'draft'">
            <li><a>Sub 1</a></li>
            <li><a>Sub Menu 2</a></li>
            <li><a>Sub Menu Name 3</a></li>
          </ul>
        </li>
      </template>
    </ul>
    
    <hr/>
    
    <p class="menu-label">
      <span class="icon is-small">
        <i class="fa fa-cogs" aria-hidden="true"></i>
      </span>
      TOOLS
    </p>
    
    <ul class="menu-list">
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
