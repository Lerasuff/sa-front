import { Connection } from '@/store/modules/socket.ts';
import { StateModel } from '@/contracts/StateModel.ts';
import Vue from 'vue';
import { BoardModules } from '@/store/modules/board.modules.ts';
import { ModuleInstance } from 'vuexok';
import { movingCards } from '@/mixins/Draggable.vue';

export class ConnectionInstance extends Connection {
  scene: ModuleInstance<BoardModules>;

  constructor(scene: ModuleInstance<BoardModules>, token: string) {
    super(token);
    this.scene = scene;
  }

  error(e: unknown): void {
    Vue.$toast.error(`${e}`);
  }
  wait(): void {
    Vue.$toast.info(`WAIT`);
  }
  ready(board: StateModel): void {
    Vue.$toast.success(`READY`);

    board.enemyBoard.cards = board.enemyBoard.cards.slice().reverse();

    this.scene.mutations.SET_HEALTH({ enemyHealth: board.enemyHealth, playerHealth: board.playerHealth });
    this.scene.mutations.SET_DECK({ cards: board.deck });
    this.scene.mutations.SET_BOARD({ name: 'playerBoard', cards: board.playerBoard, drag: false });
    this.scene.mutations.SET_BOARD({ name: 'enemyBoard', cards: board.enemyBoard, drag: false });
  }
  timeSync(timeLeft: number): void {
    this.scene.mutations.SET_TIME(timeLeft);
  }
  badMove(moveId: number): void {
    Vue.$toast.error(`BAD MOVE: ${moveId}`);
    const movement = movingCards.find((move) => move.id === moveId);
    if (movement) {
      Vue.$toast.error(`Нельзя переместить карту: ${movement}`);
    }
  }
  complete(winner: boolean): void {
    this.scene.mutations.SET_FINISH({ finish: true, update: true, win: winner });
    this.scene.mutations.SET_TIME(0);
    this.disconnect();
  }

  connected(): void {
    Vue.$toast.success('Connected');
  }

  disconnected(): void {
    this.scene.mutations.SET_DECK({ cards: this.scene.state.deck, drag: false });
    Vue.$toast.info('Disconnected');
  }
}
