<template>
  <aside class="menu">
    <p class="menu-label">
      <span class="icon is-small">
        <i class="fa fa-list" aria-hidden="true"></i>
      </span>
      ITEMS
    </p>
    <ul class="menu-list">
      <li>
        <router-link to="/items/published">
          Published
          <span class="tag">123</span>
        </router-link>
      </li>
      <li>
        <router-link to="/items/unpublished">
          Unpublished
        </router-link>
      </li>
      <li>
        <router-link to="/items/draft">
          Draft
        </router-link>
      </li>
      <li>
        <router-link to="/items/trash">
          Trash
        </router-link>
      </li>
      <li>
        <router-link to="/items">
          All
        </router-link>
      </li>
      <li>
        <hr/>
      </li>
      <p class="menu-label">
        <span class="icon is-small">
          <i class="fa fa-cogs" aria-hidden="true"></i>
        </span>
        SETTINGS
      </p>
      <li>
        <router-link to="/settings/items/fields">
          Fields
        </router-link>
      </li>
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
