<template>
  <div class="cards">
    <ul class="cards__list">
      <li
          v-for="(card, idx) in cards"
          :key="idx"
          class="cards__item"
      >
        <img class="cards__img"
             :src="card.image"
        />
        <div class="cards__info">
          <div class="cards__attack"> {{card.attack}} </div>
          <div class="cards__health"> {{card.health}} </div>
          <div class="cards__speed"> {{card.speed}} </div>
          <div class="cards__distance"> {{card.distance}} </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ScrollableList',
  props: {
    cards: {
      type: Array,
      required: true,
    },
  },
})
</script>
