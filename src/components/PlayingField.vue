<template>
  <div class="scene">
    <div class="cards card-scene"
         v-for="field in fields"
         :key="field.id"
         :class="field.name"
         @dragenter.prevent
    >
      <div class="battlefield"
           v-for="lineCard in field.board.lines"
           :key="lineCard"
      >
        <div class="field-container"
            v-for="posCard in field.board.columns"
            :key="posCard"
            :class="field.name === 'player' ? [classSlot,`slot_${lineCard + '_' + posCard}`] : ''"
             draggable="false"
        >
          <Card v-if="!!field.board.cards[lineCard-1][posCard-1]"
                :card="field.board.cards[lineCard-1][posCard-1]"
                @ondragstart="onDragStart"
                @ondrag="onDrag"
                @ondragend="onDragEnd"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import Draggable from "@/mixins/Draggable.vue";
import Vue from 'vue';
import {connection} from "@/views/Board.vue";
import {BoardModelDrag} from "@/contracts/BoardModel";

interface BattleFields {
  name: string;
  board: BoardModelDrag;
}

export default Vue.extend({
  name: "PlayingField",
  mixins: [Draggable],
  computed: {
    fields(): BattleFields[] {
      return [
        {
          name: 'enemy',
          board: connection.scene.getters.enemyBoard,
        },
        {
          name: 'player',
          board: connection.scene.getters.playerBoard,
        }
      ]
    }
  }
})
</script>