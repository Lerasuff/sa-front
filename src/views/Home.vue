<template>
  <div class="content-wrapper">
    <PlayingField/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayingField from "@/components/PlayingField.vue";

@Component({
  components: {
    PlayingField,
  }
})
export default class Home extends Vue {}
</script>