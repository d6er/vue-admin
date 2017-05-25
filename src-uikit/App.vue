<template>
  <div id="app" class="uk-container uk-container-expand">
    <router-view name="nav"></router-view>
    <div uk-grid>
      <div class="uk-width-auto">
        <router-view name="menu"></router-view>
      </div>
      <div class="uk-width-expand">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
