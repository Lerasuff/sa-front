<template>
  <div class="scene">
    <div class="board scene-board" v-for="field in fields" :key="field.id" :class="field.name" @dragenter.prevent>
      <div class="board__header health">
        <span class="health-player">{{ field.health }}</span>
      </div>
      <div class="battlefield" v-for="lineCard in field.board.lines" :key="lineCard">
        <div class="field-container" v-for="posCard in field.board.columns" :key="posCard" :class="field.name === 'player' && (!field.board.cards[lineCard - 1][posCard - 1] || field.board.cards[lineCard - 1][posCard - 1].draggable) ? [classSlot, `slot_${lineCard}_ ${posCard}`] : ''" draggable="false">
          <Card v-if="!!field.board.cards[lineCard - 1][posCard - 1]" :card="field.board.cards[lineCard - 1][posCard - 1]" @ondragstart="onDragStart" @ondrag="onDrag" @ondragend="onDragEnd" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Draggable from '@/mixins/Draggable.vue';
import Vue from 'vue';
import { connection } from '@/views/Board.vue';
import { BoardModelDrag } from '@/contracts/BoardModel';

interface BattleFields {
  name: string;
  board: BoardModelDrag;
  health: string;
}

export default Vue.extend({
  name: 'PlayingField',
  mixins: [Draggable],
  computed: {
    fields(): BattleFields[] {
      return [
        {
          name: 'enemy',
          board: connection.scene.state.enemyBoard,
          health: `Здоровье противника: ${connection.scene.state.enemyHealth}`,
        },
        {
          name: 'player',
          board: connection.scene.state.playerBoard,
          health: `Мое здоровье: ${connection.scene.state.playerHealth}`,
        },
      ];
    },
  },
});
</script>
