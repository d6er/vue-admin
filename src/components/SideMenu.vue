<template>
  <aside class="menu">
    <p class="menu-label">
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
        <hr/>
      </li>
      <li>
        <router-link to="/items/trash">
          Setting
        </router-link>
      </li>
    </ul>
  </aside>
</template>
