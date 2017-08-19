<template>
  <aside class="menu">
    
    <p class="menu-label">
      <span class="icon is-small">
        <i class="fa fa-list" aria-hidden="true"></i>
      </span>
      ITEMS
    </p>
    
    <SideMenuList parent="" parentPath="/items" depth="0"/>
    
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

<script>
import SideMenuList from './SideMenuList.vue'

export default {
  components: {
    SideMenuList: SideMenuList
  }
}  
</script>
