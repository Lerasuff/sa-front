<script lang="ts">
import Card from '@/components/Card.vue';
import Vue from 'vue';
import { CardModelDrag } from '@/contracts/CardModel.ts';
import { connection } from '@/views/Board.vue';

interface Location {
  line: number | null;
  pos: number | null;
}

class MoveCard {
  id: number;
  from: Location;
  to: Location;
  card: CardModelDrag;

  constructor(id, from, to, card) {
    this.id = id;
    this.from = from;
    this.to = to;
    this.card = card;
  }
}

interface DragCard {
  /** Клон элемента для отрисовки перемещения */
  image?: HTMLElement;
  /** Захваченный элемент карты */
  elem?: HTMLElement;
  /** Экземпляр карты */
  card?: CardModelDrag;
  /** Координаты по оси X, с которой начат перенос карты */
  downX?: number;
  /** Координаты по оси Y, с которой начат перенос карты */
  downY?: number;
  /** Сдвиг от курсора по горизонтали внутри карты */
  shiftX?: number;
  /** Сдвиг от курсора по вертикали внутри карты */
  shiftY?: number;
  /** Пограничное размещение курсора справа */
  lineRight?: number;
  /** Пограничное размещение курсора снизу */
  lineBottom?: number;
  /** Откуда перемещается карта */
  from?: Location;
}

interface Data {
  /** Размер элемента и его позиция относительно viewport */
  coords: DOMRect | null;
  /** Информация о перемещаемой карте */
  currentCard: DragCard;
  /** Количество перемещений */
  moveCount: number;
  /** Класс для drop-зоны */
  classSlot: string;
  /** Класс для deck-зоны */
  classDeck: string;
}

interface Method {
  onDragStart(e: DragEvent, item: CardModelDrag): void;
  onDrag(e: MouseEvent): void;
  onDragEnd(e: MouseEvent): void;
  onDrop(line: number | null, pos: number | null): void;
  findDroppable(e: MouseEvent): Element | null;
  findSlot(elem: Element | null): Element | null;
  countMovements(line: number | null, pos: number | null, card: CardModelDrag): void;
}

export let movingCards: MoveCard[] = [];

export default Vue.extend<Data, Method, unknown>({
  name: 'Draggable',
  components: { Card },
  data() {
    return {
      coords: null,
      currentCard: {},
      moveCount: 0,
      classSlot: 'card-slot',
      classDeck: 'deck_card',
    };
  },
  methods: {
    onDragStart(e, item) {
      if (!e.dataTransfer) return;
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setDragImage(new Image(), 0, 0);

      this.currentCard.elem = e.target as HTMLElement;
      this.currentCard.card = item;

      let from = this.findSlot(this.currentCard.elem);

      if (!from) {
        this.currentCard = {};
        return;
      } else if (from.classList.contains(this.classDeck)) {
        this.currentCard.from = {
          line: null,
          pos: connection.scene.state.deck.findIndex((card) => card.num === item.num),
        };
      } else {
        let arrSlot = from.className.split('_');
        this.currentCard.from = {
          line: parseInt(arrSlot[1]) - 1,
          pos: parseInt(arrSlot[2]) - 1,
        };
      }

      this.currentCard.downX = e.pageX;
      this.currentCard.downY = e.pageY;
    },
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

        this.currentCard.image = this.currentCard.elem.cloneNode(true) as HTMLElement;
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
        this.currentCard.image.style.zIndex = '9999';
        this.currentCard.image.style.position = 'absolute';

        this.currentCard.image.style.left = this.currentCard.downX - this.currentCard.shiftX + 'px';
        this.currentCard.image.style.top = this.currentCard.downY - this.currentCard.shiftY + 'px';
      } else {
        if (e.pageX === 0 && e.pageY === 0) return;

        if (!this.currentCard.shiftX) this.currentCard.shiftX = 0;
        if (!this.currentCard.lineRight) this.currentCard.lineRight = 0;
        if (!this.currentCard.shiftY) this.currentCard.shiftY = 0;
        if (!this.currentCard.lineBottom) this.currentCard.lineBottom = 0;

        if (e.pageX < this.currentCard.shiftX) this.currentCard.image.style.left = '0px';
        else if (e.pageX > this.currentCard.lineRight) this.currentCard.image.style.left = this.currentCard.lineRight - this.currentCard.shiftX + 'px';
        else this.currentCard.image.style.left = e.pageX - this.currentCard.shiftX + 'px';

        if (e.pageY < this.currentCard.shiftY) this.currentCard.image.style.top = '0px';
        else if (e.pageY > this.currentCard.lineBottom) this.currentCard.image.style.top = this.currentCard.lineBottom - this.currentCard.shiftY + 'px';
        else this.currentCard.image.style.top = e.pageY - this.currentCard.shiftY + 'px';

        /*let cardSlots = document.getElementsByClassName(this.classSlot);
        cardSlots.forEach(slot => slot.style.removeProperty('background-color'));

        let dropElem = this.findDroppable(e);

        if (dropElem && !dropElem.classList.contains(this.classDeck)) {
          dropElem.style.backgroundColor = 'lavender';
        }*/
      }
    },
    onDragEnd(e) {
      let dropElem = this.findDroppable(e);

      if (!this.currentCard.elem || !this.currentCard.image) return;

      if (!dropElem) {
        this.currentCard.elem.style.removeProperty('display');
      } else {
        let classElem = dropElem.className;
        let pos: number | null = null,
          line: number | null = null;

        if (classElem.indexOf(this.classDeck) < 0) {
          let arrSlot = classElem.split('_');
          line = parseInt(arrSlot[1]) - 1;
          pos = parseInt(arrSlot[2]) - 1;
        }
        this.onDrop(line, pos);
        this.currentCard.elem.style.removeProperty('display');
      }

      //dropElem.style.removeProperty('background-color');
      this.coords = null;
      this.currentCard.image.remove();
      this.currentCard = {};
    },
    onDrop(line, pos) {
      if (!this.currentCard.card || !this.currentCard.from || this.currentCard.from.pos === null) return;

      const card: CardModelDrag = this.currentCard.card;

      this.countMovements(line, pos, card);

      if (line !== null && pos !== null) {
        const player = connection.scene.state.playerBoard.cards;

        if (this.currentCard.from.line === null) {
          if (this.currentCard.from.pos > -1) {
            connection.scene.mutations.DELETE_FROM_DECK(this.currentCard.from.pos);
          }
        } else {
          connection.scene.mutations.DELETE_FROM_BOARD({
            line: this.currentCard.from.line,
            col: this.currentCard.from.pos,
          });
        }

        if (player[line][pos]) {
          connection.scene.mutations.ADD_IN_DECK(player[line][pos] as CardModelDrag);
        }

        connection.sendBoardUpdate(this.moveCount, line, pos, card.num);
        connection.scene.mutations.ADD_IN_BOARD({
          line: line,
          col: pos,
          card: card,
        });
      } else if (this.currentCard.from.line !== null) {
        connection.scene.mutations.DELETE_FROM_BOARD({
          line: this.currentCard.from.line,
          col: this.currentCard.from.pos,
        });
        connection.scene.mutations.ADD_IN_DECK(card);
      } else {
        this.moveCount--;
        movingCards.pop();
        return;
      }
      this.$emit('updated');
    },
    findDroppable(e) {
      if (e.clientX < 0 || e.clientY < 0 || e.clientX > document.body.offsetWidth || e.clientY > document.body.offsetHeight || !this.currentCard.image) return null;

      this.currentCard.image.hidden = true;
      let elem = document.elementFromPoint(e.clientX, e.clientY);
      this.currentCard.image.hidden = false;

      if (!elem) return null;

      return this.findSlot(elem);
    },
    findSlot(elem) {
      if (!elem || elem.tagName === 'BODY') return null;

      if (elem.classList.contains(this.classSlot)) return elem;
      else return this.findSlot(elem.parentElement);
    },
    countMovements(line, pos, card) {
      this.moveCount++;
      movingCards.push(
        new MoveCard(
          this.moveCount,
          this.currentCard.from,
          {
            line: line,
            pos: pos,
          },
          card,
        ),
      );
    },
  },
});
</script>
