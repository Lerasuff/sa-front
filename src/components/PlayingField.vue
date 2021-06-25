<template>
  <div class="scene">
    <div class="cards card-scene"
         v-for="field in fields"
         :key="field.id"
         :class="field.classBattleField"
         @dragenter.prevent
    >
      <div class="battlefield"
           v-for="lineCard in countLine"
           :key="lineCard"
      >
        <div class="field-container"
            v-for="posCard in countCardInLine"
            :key="posCard"
            :class="field.classBattleField === classField.your ? [classSlot,`slot_${lineCard + '_' + posCard}`] : ''"
             draggable="false"
        >
          <Card v-if="!!field.arrayCard[lineCard][posCard]"
                :card="field.arrayCard[lineCard][posCard]"
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
import Vue from 'vue'
import {CardModel} from "@/contracts/CardModel.ts";

interface BattleFields {
  classBattleField: number;
  arrayCard: CardModel[][];
}

interface Data {
  countLine: number;
}

interface Computed {
  fields(): BattleFields[];
}

export default Vue.extend<unknown,unknown,Computed,unknown>({
  name: "PlayingField",
  mixins: [Draggable],
  data(): Data {
    return {
      countLine: 2,
    };
  },
  computed: {
    fields() {
      return [
        {
          classBattleField: this.classField.enemy,
          arrayCard: this.enemyCombat
        },
        {
          classBattleField: this.classField.your,
          arrayCard: this.meCombat
        }
      ]
    }
  }
})
</script>