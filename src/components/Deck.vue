<template>
  <div :class="[classDeck, !connection.scene.state.needUpdate ? classSlot : '']">
    <Card v-for="card in connection.scene.state.deck" :key="card.id" :card="card" @ondragstart="onDragStart" @ondrag="onDrag" @ondragend="onDragEnd" />
  </div>
</template>

<script lang="ts">
import Draggable from '@/mixins/Draggable.vue';
import Vue from 'vue';
import { connection } from '@/views/Board.vue';
import { ConnectionInstance } from '@/store/modules/board';

interface Data {
  connection: ConnectionInstance;
}

export default Vue.extend({
  name: 'Deck',
  mixins: [Draggable],
  data(): Data {
    return {
      connection,
    };
  },
});
</script>
