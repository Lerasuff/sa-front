<script lang="ts">
import {
  removeCard
} from "@/utils/helpers";
import Card from "@/components/Card.vue";
import Vue from 'vue'
import {CardModel} from "@/contracts/CardModel";

interface Method {
  onDrag(
      e: Event
  ): void;
  onDragStart(
      e: Event,
      item: CardModel
  ): void;
  onDragEnd(
      e: Event
  ): void;
  findDroppable(
      e: Event
  ): unknown;
  findSlot(
      elem: Element
  ): unknown;
  onDrop(
      line: number,
      pos: number
  ): void;
  /*addDeck(
      card: CardModel
  ): never;*/
}

interface DragCard {
  image?: Node;
  elem?: HTMLElement ;
  item?: CardModel;
  downX?: number;
  downY?: number;
  shiftX?: number;
  shiftY?: number;
  lineRight?: number;
  lineBottom?: number;

}

interface Data {
  countCardInLine: number;
  coords: DOMRect | null;
  currentCard: DragCard;
  classSlot: string;
  classDeck: string;
}

export default Vue.extend({
  name: "Draggable",
  components: {Card},
  data(): Data {
    return {
      countCardInLine: 8,
      coords: null,
      currentCard: {},
      classSlot: 'card-slot',
      classDeck: 'deck_card'
    }
  },
  methods: {
    onDrag(e) {
      if (!this.currentCard.elem) return;

      if (!this.currentCard.image) {
        if (!this.currentCard.downX) this.currentCard.downX = 0;
        if (!this.currentCard.downY) this.currentCard.downY = 0;

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
        (this.currentCard.image as HTMLElement).style.zIndex = '9999';
        (this.currentCard.image as HTMLElement).style.position = 'absolute';

        (this.currentCard.image as HTMLElement).style.left = this.currentCard.downX - this.currentCard.shiftX + 'px';
        (this.currentCard.image as HTMLElement).style.top = this.currentCard.downY - this.currentCard.shiftY + 'px';

      } else {
        if (e.pageX === 0 && e.pageY === 0) return;

        if (!this.currentCard.shiftX) this.currentCard.shiftX = 0;
        if (!this.currentCard.lineRight) this.currentCard.lineRight = 0;
        if (!this.currentCard.shiftY) this.currentCard.shiftY = 0;
        if (!this.currentCard.lineBottom) this.currentCard.lineBottom = 0;

        if (e.pageX < this.currentCard.shiftX)
          (this.currentCard.image as HTMLElement).style.left = '0px';
        else if (e.pageX > this.currentCard.lineRight)
          (this.currentCard.image as HTMLElement).style.left = this.currentCard.lineRight - this.currentCard.shiftX + 'px';
        else
          (this.currentCard.image as HTMLElement).style.left = e.pageX - this.currentCard.shiftX + 'px';

        if (e.pageY < this.currentCard.shiftY)
          (this.currentCard.image as HTMLElement).style.top = '0px';
        else if (e.pageY > this.currentCard.lineBottom)
          (this.currentCard.image as HTMLElement).style.top = this.currentCard.lineBottom - this.currentCard.shiftY + 'px';
        else
          (this.currentCard.image as HTMLElement).style.top = e.pageY - this.currentCard.shiftY + 'px';


        /*let cardSlots = document.getElementsByClassName(this.classSlot);
        cardSlots.forEach(slot => slot.style.removeProperty('background-color'));

        let dropElem = this.findDroppable(e);

        if (dropElem && !dropElem.classList.contains(this.classDeck)) {
          dropElem.style.backgroundColor = 'lavender';
        }*/
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
        (this.currentCard.elem as HTMLElement).style.removeProperty('display');
      } else {
        let classElem = dropElem.className;
        let pos = null, line = null;

        if (classElem.indexOf(this.classDeck) < 0) {
          let arrSlot = classElem.split('_');
          line = arrSlot[1];
          pos = arrSlot[2];
        }
        this.onDrop(line, pos);
        (this.currentCard.elem as HTMLElement).style.removeProperty('display');
      }

      //dropElem.style.removeProperty('background-color');
      this.coords = null;
      (this.currentCard.image as HTMLElement).remove();
      this.currentCard = {};
    },
    findDroppable(e) {
      if (e.clientX < 0 || e.clientY < 0 ||
          e.clientX > document.body.offsetWidth  ||
          e.clientY > document.body.offsetHeight ) return null;

      (this.currentCard.image as HTMLElement).hidden = true;
      let elem = document.elementFromPoint(e.clientX, e.clientY);
      (this.currentCard.image as HTMLElement).hidden = false;

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
      //let index, fromCard = [], toCard = [];
      //const currentCard = this.currentCard.item;

      // if (!line && !pos && currentCard.props.status === attachCard.deck) {
      //   return;
      // }

      //fromCard = removeCard(fromCard,currentCard);

      if (line && pos) {
        //currentCard.props.status = attachCard.player;
        //toCard = meCombat;

        /*if (toCard[line][pos]) {
          this.addDeck(toCard[line][pos]);
        }*/

        //toCard[index] = {};
        //toCard[index] = currentCard;

      } /*else {
        this.addDeck(currentCard);
      }*/

      this.$emit('updated');
    },
    /*addDeck(card: CardModel) {
      /!*card.props.status = attachCard.deck;
      deck.push(card);*!/
    }*/
  }
})
</script>