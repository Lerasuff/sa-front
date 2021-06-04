<template>
  <div class="content-wrapper">
    <PlayingField ref="PlayingField"
                  @updated="updatePage"
    />
    <RightPanel
        @updated="updatePage"
    />
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
  },
  methods: {
    updatePage() {
      this.$refs['PlayingField'].$forceUpdate();
    }
  }
})
export default class Home extends Vue {}
</script>