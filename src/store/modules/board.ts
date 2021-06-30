import {Connection} from "@/store/modules/socket.ts";
import {StateModel} from "@/contracts/StateModel.ts";
import {StepModel} from "@/contracts/StepModel.ts";
import Vue from 'vue';
import {BoardModules} from "@/store/modules/board.modules.ts"
import { ModuleInstance} from "vuexok";

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

    this.scene.mutations.SET_DECK({cards: board.deck, drag: true});
    this.scene.mutations.SET_BOARD({name: 'playerBoard', cards: board.playerBoard, drag: true});
    this.scene.mutations.SET_BOARD({name: 'enemyBoard', cards: board.enemyBoard, drag: false});

    setTimeout(() => {
      if (!this.scene.getters.gameFinished) {
        for (let i = 0; i < board.playerBoard.lines; i++) {
          for (let j = 0; j < board.playerBoard.columns; j++) {
            if (null === board.playerBoard.cards[i][j]) {
              const card = board.deck.pop();
              if (card)
                this.sendBoardUpdate(i, j, card.num);
            }
          }
        }
        this.sendBoardReady();
      }
    }, 10000);
  }
  timeSync(timeLeft: number): void {
    //Vue.$toast.info(`TIME LEFT: ${timeLeft}`);
  }
  steps(steps: StepModel[]): void {
    //Vue.$toast.info('REPLY STEPS');
  }
  complete(winnerId: string): void {
    Vue.$toast.success(`WINNER: ${winnerId}`);
    //this.scene.gameFinished = true;
    this.scene.mutations.SET_FINISH(true);
    this.disconnect();
  }

  connected(): void {
    Vue.$toast.success('Connected');
  }

  disconnected(): void {
    Vue.$toast.info('Disconnected');
  }
}