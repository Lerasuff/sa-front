<template>
  <div class="content-wrapper">
    <PlayingField ref="PlayingField" @updated="updatePage" />
    <RightPanel @updated="updatePage" />
    <Popup v-if="showPopup" :popup-message="resultGame.message" :popup-class="resultGame.class" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayingField from '@/components/PlayingField.vue';
import RightPanel from '@/components/RightPanel.vue';
import Popup, { PopupClasses } from '@/components/ui/Popup.vue';
import { ConnectionInstance } from '@/store/modules/board.ts';
import authModule from '@/store/modules/auth.module';
import boardStateModule from '@/store/modules/board.modules';

export let connection: ConnectionInstance;

interface ResultPopup {
  class: PopupClasses;
  message: string;
}

export default Vue.extend({
  name: 'Board',
  components: {
    RightPanel,
    PlayingField,
    Popup,
  },
  computed: {
    resultGame(): ResultPopup {
      if (connection.scene.state.isWinner) {
        return {
          class: PopupClasses.win,
          message: 'Вы победили!',
        };
      } else {
        return {
          class: PopupClasses.fail,
          message: 'Вы проиграли!',
        };
      }
    },
    showPopup(): boolean {
      return !!connection && connection.scene.state.gameFinished && connection.scene.state.needUpdate;
    },
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
    boardStateModule.mutations.CLEAR_STATE();
    connection.disconnect();
  },
});
</script>
