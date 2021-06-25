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

<script lang="ts">

import Draggable from "@/mixins/Draggable.vue";
import Vue from 'vue'

export default Vue.extend({
  name: "Deck",
  mixins: [Draggable]
})
</script>