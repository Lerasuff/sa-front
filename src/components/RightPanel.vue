<template>
  <div class="right_panel">
    <div class="clock-wrapper">
      <span class="clock__title">Таймер:</span>
      <div class="clock-inner">
        {{ connection.scene.state.timeSync }}
      </div>
    </div>
    <Deck @updated="$emit('updated')" />
    <div class="active">
      <button-base button-value="Старт" :button-type="ButtonTypes.btnSubmit" :is-button-disabled="connection.scene.state.gameFinished" @onClick="onStart" />
      <button-base button-value="Выход" :button-type="ButtonTypes.btnButton" @onClick="onExit" />
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

interface Data {
  connection: ConnectionInstance;
  ButtonTypes;
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
  methods: {
    onStart(): void {
      connection.sendBoardReady();
    },
    onExit(): void {
      authModule.actions.A_LOGOUT();
    },
  },
});
</script>
