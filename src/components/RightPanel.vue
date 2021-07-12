<template>
  <div class="right_panel">
    <div class="clock-wrapper">
      <span class="clock__title">Таймер:</span>
      <div class="clock-inner" :style="timer.style">
        {{ timer.value }}
      </div>
    </div>
    <Deck @updated="$emit('updated')" />
    <div class="active">
      <button-base button-value="Запуск"
                   :button-type="ButtonTypes.btnSubmit"
                   :is-button-disabled="isDisable"
                   @onClick="onStart"
      />
      <button-base button-value="Выход"
                   :button-type="ButtonTypes.btnButton"
                   @onClick="onExit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Deck from '@/components/Deck.vue';
import ButtonBase, { ButtonTypes } from '@/components/ui/ButtonBase.vue';
import authModule from '@/store/modules/auth.module';
import { connection } from '@/views/Board.vue';
import { ConnectionInstance } from '@/store/modules/board';
import moment from 'moment';
import { GameStatus, NameBoard } from '@/store/modules/board.modules';

interface Data {
  connection: ConnectionInstance;
  ButtonTypes;
}

interface Timer {
  value: string;
  style: { animation: string } | null;
}

export default Vue.extend({
  name: 'RightPanel',
  components: { Deck, ButtonBase },
  data(): Data {
    return {
      connection,
      ButtonTypes,
    };
  },
  computed: {
    timer(): Timer {
      let time: number = connection.scene.state.timeSync;
      let style: { animation: string } | null = null;

      if (time <= 10000 && time > 0) style = { animation: 'clock .9s linear infinite' };

      return {
        value: moment.utc(time).format('mm:ss'),
        style: style,
      };
    },
    isDisable(): boolean {
      return (connection.scene.state.gameStatus !== GameStatus.Ready);
    },
  },
  methods: {
    onStart(): void {
      connection.sendBoardReady();
      connection.scene.mutations.SET_STATUS(GameStatus.WaitMove);
      connection.scene.mutations.SET_DECK({ drag: false });
      connection.scene.mutations.SET_BOARD({ name: NameBoard.Player ,drag: false });
    },
    onExit(): void {
      authModule.actions.A_LOGOUT();
    },
  },
});
</script>
