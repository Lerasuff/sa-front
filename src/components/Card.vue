<template>
  <div class="card-container" :class="`card_${card.num}`" :draggable="card.draggable" @dragstart="$emit('ondragstart', $event, card)" @drag="$emit('ondrag', $event)" @dragend="$emit('ondragend', $event)">
    <img class="card__img" :src="require(`@/assets/images/cards/${cardImages[card.num % cardImages.length]}`)" draggable="false" />
    <div class="card__info">
      <div class="info card__attack">atk: {{ card.stats.atk }}</div>
      <div class="info card__health">hp: {{ card.stats.hp }}</div>
      <div class="info card__speed">spd: {{ card.stats.spd }}</div>
      <div class="info card__distance">dis: {{ card.stats.dis }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { CardModelDrag } from '@/contracts/CardModel.ts';

const cardImages = ['01.png', '02.png', '03.png', '04.png', '05.png', '06.png', '07.png', '08.png'];

interface Data {
  cardImages: string[];
}

export default Vue.extend({
  name: 'Card',
  props: {
    card: {
      type: Object as PropType<CardModelDrag>,
      required: true,
    },
  },
  data(): Data {
    return {
      cardImages,
    };
  },
});
</script>
