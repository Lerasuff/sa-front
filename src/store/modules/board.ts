import { Connection } from '@/store/modules/socket.ts';
import { StateModel } from '@/contracts/StateModel.ts';
import Vue from 'vue';
import {BoardModules, GameStatus, NameBoard} from '@/store/modules/board.modules.ts';
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
    this.scene.mutations.SET_STATUS(GameStatus.Error);
  }
  wait(): void {
    //Vue.$toast.info(`WAIT`);
    this.scene.mutations.SET_STATUS(GameStatus.Wait);
  }
  ready(board: StateModel): void {
    //Vue.$toast.success(`READY`);

    board.enemyBoard.cards = board.enemyBoard.cards.slice().reverse();

    this.scene.mutations.SET_STATUS(GameStatus.Ready);
    this.scene.mutations.SET_HEALTH({ enemyHealth: board.enemyHealth, playerHealth: board.playerHealth });
    this.scene.mutations.SET_DECK({ cards: board.deck });
    this.scene.mutations.SET_BOARD({ name: NameBoard.Player, cards: board.playerBoard, drag: false });
    this.scene.mutations.SET_BOARD({ name: NameBoard.Enemy, cards: board.enemyBoard, drag: false });

    if (board.deck.length === 0)
      this.sendBoardReady();
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
    this.scene.mutations.SET_STATUS(GameStatus.Finish);
    this.scene.mutations.SET_WIN(winner);
    this.scene.mutations.SET_TIME(0);
    this.disconnect();
  }

  connected(): void {
    //Vue.$toast.success('Connected');
    this.scene.mutations.SET_STATUS(GameStatus.Connect);
  }

  disconnected(): void {
    this.scene.mutations.SET_DECK({ drag: false });
    this.scene.mutations.SET_STATUS(GameStatus.Disconnect);
    //Vue.$toast.info('Disconnected');
  }
}
