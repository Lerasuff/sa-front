<template>
  <div class="content-wrapper">
    <PlayingField/>
    <RightPanel/>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import PlayingField from "@/components/PlayingField.vue";
import RightPanel from "@/components/RightPanel.vue";

@Component({
  components: {
    RightPanel,
    PlayingField,
  }
})
export default class Home extends Vue {}
</script>