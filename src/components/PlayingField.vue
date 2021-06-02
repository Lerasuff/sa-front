<template>
  <div class="scene">
    <div class="cards card-scene"
         @dragover.prevent
         @dragenter.prevent
    >
      <div class="my-field battlefield"
           v-for="lineCard in countLine"
           :key="lineCard"
      >
        <div class="field-container"
            v-for="posCard in countCardInLine"
            :key="posCard"
            :class="[classSlot,`${'slot_' + lineCard + '_' + posCard}`]"
        >
          <Card v-if="!!meCombat[calcCardIndex(lineCard,posCard,countCardInLine)]"
                :card="meCombat[calcCardIndex(lineCard,posCard,countCardInLine)]"
                @ondragstart="onDragStart"
                @ondrag="onDrag"
                @ondragend="onDragEnd"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Draggable from "@/mixins/Draggable";

const countLine = 2;

export default {
  name: "PlayingField",
  mixins: [Draggable],
  data() {
    return {
      countLine
    }
  }
}
</script>