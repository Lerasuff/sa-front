<template>
  <div class="content-wrapper">
    <PlayingField ref="PlayingField" @updated="updatePage" />
    <RightPanel @updated="updatePage" />
    <Popup v-if="showPopup" :popup-title="resultGame.title" :popup-message="resultGame.message" :popup-class="resultGame.class" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import PlayingField from '@/components/PlayingField.vue';
import RightPanel from '@/components/RightPanel.vue';
import Popup, { PopupClasses } from '@/components/ui/Popup.vue';
import { ConnectionInstance } from '@/store/modules/board.ts';
import authModule from '@/store/modules/auth.module';
import boardStateModule, { GameStatus } from '@/store/modules/board.modules';

export let connection: ConnectionInstance;

interface ResultPopup {
  class: PopupClasses;
  title: string;
  message?: string;
}

export default Vue.extend({
  name: 'Board',
  components: {
    RightPanel,
    PlayingField,
    Popup,
  },
  computed: {
    resultGame(): ResultPopup | null {
      if (connection.scene.state.gameStatus === GameStatus.Wait) {
        return {
          class: PopupClasses.info,
          title: 'Подождите',
          message: 'Идет поиск соперника',
        };
      }

      if (connection.scene.state.isWinner === undefined)
        return null;

      if (connection.scene.state.isWinner) {
        return {
          class: PopupClasses.win,
          title: 'Вы победили!',
        };
      } else {
        return {
          class: PopupClasses.fail,
          title: 'Вы проиграли!',
        };
      }
    },
    showPopup(): boolean {
      return !!connection && (connection.scene.state.gameStatus === GameStatus.Wait || connection.scene.state.isWinner !== undefined);
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
