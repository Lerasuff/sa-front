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

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PlayingField from "@/components/PlayingField.vue";
import RightPanel from "@/components/RightPanel.vue";
import {Connection} from "@/store/modules/socket.ts";
import {ConnectionInstance} from "@/store/modules/board.ts";
import authModule from "@/store/modules/auth.module";
import boardStateModule from "@/store/modules/board.modules";

export let connection: ConnectionInstance;

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
  created() {
    if (authModule.getters.token) {
      connection = new ConnectionInstance(boardStateModule, authModule.getters.token);
      connection.connect('testdeck');
    }
  },
  destroyed() {
    (connection as Connection).disconnect();
  }
})
export default class Board extends Vue {}
</script>