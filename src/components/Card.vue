<template>
  <div class="card-container" :style="card.props.style"
       :class="`${'card' + card.id}`"
       draggable="true"
       @dragstart="$emit('ondragstart',$event, card)"
       @drag="$emit('ondrag',$event)"
       @dragend="$emit('ondragend',$event)"
  >
    <img class="card__img"
         :src="card.image"
         draggable="false"
    />
    <div class="card__info">
      <div class="card__attack"> {{ card.attack }}</div>
      <div class="card__health"> {{ card.health }}</div>
      <div class="card__speed"> {{ card.speed }}</div>
      <div class="card__distance"> {{ card.distance }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
  props: {
    card: {
      type: Object,
      required: true
    }
  }
}
</script>