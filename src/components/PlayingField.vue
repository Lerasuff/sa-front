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
    <div :class="[classDeck,classSlot]">
      <Card v-for="card in deck"
            :key="card.id"
            :card="card"
            @ondragstart="onDragStart"
            @ondrag="onDrag"
            @ondragend="onDragEnd"
      />
    </div>
  </div>
</template>

<script>

import {
  generateItems,
  getRandomCharacteristic,
  removeCard,
  calcCardIndex,
  cardStatus
} from "@/utils/helpers";
import Card from "@/components/Card";

const countLine = 2;
const countCardInLine = 8;

const cardImages = [
  '01.png',
  '02.png',
  '03.png',
  '04.png',
  '05.png',
  '06.png',
  '07.png',
  '08.png',
]

let deck = generateItems(32, i => ({
  id: `${Math.trunc(i / cardImages.length)}${i % cardImages.length + 1}`,
  props: {
    status: cardStatus.deck,
    draggable: true
  },
  attack: getRandomCharacteristic(10),
  health: getRandomCharacteristic(10),
  speed: getRandomCharacteristic(10),
  distance: getRandomCharacteristic(10),
  image: require(`@/assets/images/cards/${cardImages[i % cardImages.length]}`),
}))


export default {
  name: "PlayingField",
  components: {Card},
  data() {
    return {
      countLine,
      countCardInLine,
      deck,
      cardStatus,
      coords: {},
      currentCard: {},
      classSlot: 'card-slot',
      classDeck: 'deck_card',
      meCombat: [],
      enemyCombat: []
    }
  },
  methods: {
    calcCardIndex,
    onDrag(e) {
      if (!this.currentCard.elem) return;

      if (!this.currentCard.image) {
        let moveX = e.pageX - this.currentCard.downX;
        let moveY = e.pageY - this.currentCard.downY;

        if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
          return;
        }

        this.currentCard.image = this.currentCard.elem.cloneNode(true);
        if (!this.currentCard.image) {
          this.currentCard = {};
          return;
        }

        this.coords = this.currentCard.elem.getBoundingClientRect();
        this.currentCard.shiftX = this.currentCard.downX - this.coords.left;
        this.currentCard.shiftY = this.currentCard.downY - this.coords.top;
        this.currentCard.lineBottom = document.body.offsetHeight - this.coords.height + this.currentCard.shiftY;
        this.currentCard.lineRight = document.body.offsetWidth - this.coords.width + this.currentCard.shiftX;

        this.currentCard.elem.style.display = 'none';
        document.body.appendChild(this.currentCard.image);
        this.currentCard.image.style.zIndex = 9999;
        this.currentCard.image.style.position = 'absolute';

        this.currentCard.image.style.left = this.currentCard.downX - this.currentCard.shiftX + 'px';
        this.currentCard.image.style.top = this.currentCard.downY - this.currentCard.shiftY + 'px';

      } else {
        if (e.pageX === 0 && e.pageY === 0) return;

        if (e.pageX < this.currentCard.shiftX)
          this.currentCard.image.style.left = '0px';
        else if (e.pageX > this.currentCard.lineRight)
          this.currentCard.image.style.left = this.currentCard.lineRight - this.currentCard.shiftX + 'px';
        else
          this.currentCard.image.style.left = e.pageX - this.currentCard.shiftX + 'px';

        if (e.pageY < this.currentCard.shiftY)
          this.currentCard.image.style.top = '0px';
        else if (e.pageY > this.currentCard.lineBottom)
          this.currentCard.image.style.top = this.currentCard.lineBottom - this.currentCard.shiftY + 'px';
        else
          this.currentCard.image.style.top = e.pageY - this.currentCard.shiftY + 'px';

      }
    },
    onDragStart(e, item) {
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(new Image(), 0, 0);

      this.currentCard.elem = e.target;
      this.currentCard.item = item;

      this.currentCard.downX = e.pageX;
      this.currentCard.downY = e.pageY;
    },
    onDragEnd(e) {
      let dropElem = this.findDroppable(e);

      if (!dropElem) {
        this.currentCard.elem.style.removeProperty('display');
      } else {
        let classElem = dropElem.className;
        let pos = null, line = null;

        if (classElem.indexOf(this.classDeck) < 0) {
          let arrSlot = classElem.split('_');
          pos = arrSlot[1];
          line = arrSlot[2];
        }
        this.onDrop(line, pos);
        this.currentCard.elem.style.removeProperty('display');
      }

      this.coords = {};
      this.currentCard.image.remove();
      this.currentCard = {};
    },
    findDroppable(e) {
      if (e.clientX < 0 || e.clientY < 0 ||
          e.clientX > document.body.offsetWidth  ||
          e.clientY > document.body.offsetHeight ) return null;

      this.currentCard.image.hidden = true;
      let elem = document.elementFromPoint(e.clientX, e.clientY);
      this.currentCard.image.hidden = false;

      return this.findSlot(elem);
    },
    findSlot(elem) {
      if (elem.tagName === 'BODY') return null;

      if (elem.classList.contains(this.classSlot))
        return elem;
      else
        return this.findSlot(elem.parentElement);
    },
    onDrop(line, pos) {
      let index, fromCard = [], toCard = [];
      const currentCard = this.currentCard.item;

      switch (currentCard.props.status) {
        case cardStatus.deck:
          fromCard = deck;
          break;
        case cardStatus.battle:
          fromCard = this.meCombat;
          break;
        default:
          return;
      }

      fromCard = removeCard(fromCard,currentCard);

      if (line && pos) {
        index = calcCardIndex(line, pos, countCardInLine);
        currentCard.props.status = cardStatus.battle;
        toCard = this.meCombat;

        if (toCard[index]) {
          this.addDeck(toCard[index]);
        }

        toCard[index] = {};
        Object.assign(toCard[index], currentCard);
      } else {
        this.addDeck(currentCard);
      }

      this.$forceUpdate();
    },
    addDeck(card) {
      card.props.status = cardStatus.deck;
      deck.push(card);
    }
  }
}
</script>