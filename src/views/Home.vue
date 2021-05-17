<template>
  <div class="content-wrapper">
    <CardsDragable />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CardsDragable from '@/components/CardsDragable.vue'; // @ is an alias to /src

@Component({
  components: {
    CardsDragable,
  },
  data() {
    return {
      cards: [
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/01.png'),
        },
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/02.png'),
        },
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/03.png'),
        },
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/04.png'),
        },
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/05.png'),
        },
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/06.png'),
        },
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/07.png'),
        },
        {
          attack: '1',
          health: '2',
          speed: '3' ,
          distance: '4',
          image: require('@/assets/images/cards/08.png'),
        },
      ]
    };
  }
})
export default class Home extends Vue {}
</script>