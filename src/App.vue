<template>
  <section id="app">
    <div class="columns">
      <div class="column">
        <router-view name="nav"></router-view>
      </div>
    </div>
    <div class="container is-fluid">
      <div class="columns">
        <div class="column is-narrow">
          <router-view name="menu"></router-view>
        </div>
        <div class="column">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </section>
</template>
