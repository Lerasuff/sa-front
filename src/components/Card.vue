<template>
  <div class="card-container"
       :class="`card${card.num}`"
       :draggable="card.draggable"
       @dragstart="$emit('ondragstart',$event, card)"
       @drag="$emit('ondrag',$event)"
       @dragend="$emit('ondragend',$event)"
  >
    <img class="card__img"
         :src="card.skin"
         draggable="false"
    />
    <div class="card__info">
      <div class="card__attack"> {{ card.stats.atk }}</div>
      <div class="card__health"> {{ card.stats.hp }}</div>
      <div class="card__speed"> {{ card.stats.spd }}</div>
      <div class="card__distance"> {{ card.stats.dis }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import {CardModel} from "@/contracts/CardModel.ts";

export default Vue.extend({
  name: "Card",
  props: {
    card: {
      type: Object as PropType<CardModel>,
      required: true
    }
  }
})
</script>