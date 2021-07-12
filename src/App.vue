<template>
  <div id="app">
    <router-view />
    <loading :active="isLoading" :opacity="0.7" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import requestModule from '@/store/modules/request.module.ts';

export default Vue.extend({
  name: 'App',
  computed: {
    isLoading() {
      return requestModule.getters.IS_LOADING;
    },
  },
});
</script>

<style lang="scss">
@import 'src/assets/scss/style.scss';
</style>
