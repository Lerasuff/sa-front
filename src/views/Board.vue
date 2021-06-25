<template>
  <div class="content-wrapper">
<!--    <PlayingField ref="PlayingField"
                  @updated="updatePage"
    />-->
    <RightPanel
        @updated="updatePage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayingField from "@/components/PlayingField.vue";
import RightPanel from "@/components/RightPanel.vue";
import {ConnectionInstance} from "@/store/modules/board.ts";
import authModule from "@/store/modules/auth.module";

let connection: (ConnectionInstance | undefined) = undefined;

@Component({
  components: {
    RightPanel,
    PlayingField,
  },
  methods: {
    updatePage(): void {
      (this.$refs['PlayingField'] as Vue).$forceUpdate();
    },
  },
  mounted() {
    connection = new ConnectionInstance(authModule.getters.token);
    connection.connect('testdeck');
  }
})
export default class Board extends Vue {}
</script>