<template>
  <div id="tab-picture">
    <div class="columns">
      <div class="column" v-for="i in 6">
        <div class="card">
          <header class="card-header">
            <p class="card-header-title">
              {{ i }}
            </p>
            <a class="card-header-icon">
              <span class="icon">
                <i class="fa fa-angle-down"></i>
              </span>
            </a>
          </header>
          <div class="card-image has-text-centered">
            <figure class="image is-128x128">
              <img src="http://bulma.io/images/placeholders/128x128.png">
            </figure>
          </div>
          <footer class="card-footer">
            <a class="card-footer-item">a</a>
            <a class="card-footer-item">a</a>
            <a class="card-footer-item">a</a>
          </footer>
        </div>
      </div>
    </div>
    <input type="file">
  </div>
</template>
<script>
export default {
  props: ['item']
}
</script>
