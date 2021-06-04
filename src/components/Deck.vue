<template>
  <div :class="[classDeck,classSlot]">
    <Card v-for="card in deck"
          :key="card.id"
          :card="card"
          @ondragstart="onDragStart"
          @ondrag="onDrag"
          @ondragend="onDragEnd"
    />
  </div>
</template>

<script>

import Draggable from "@/mixins/Draggable";

export default {
  name: "Deck",
  mixins: [Draggable],
  data() {
    return {
    }
  }
}
</script>