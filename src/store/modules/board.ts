import {Connection} from "@/store/modules/socket.ts";
import {StateModel} from "@/contracts/StateModel";
import {StepModel} from "@/contracts/StepModel";

export class ConnectionInstance extends Connection {

  error(e: unknown): void {
    //this.scene.header.text = `[${this.scene.player.name}]: ${e}`;
  }
  wait(): void {
    //this.scene.header.text = `[${this.scene.player.name}]: WAIT`;
  }
  ready(board: StateModel): void {
    //this.scene.header.text = `[${this.scene.player.name}]: READY`;
    //this.scene.playerBoard = board.playerBoard;
    //this.scene.enemyBoard = board.enemyBoard;

    //this.scene.drawBattlefield();

    //const self = this;
 /*   setTimeout(() => {
      if (!self.scene.gameFinished) {
        for (let i = 0; i < board.playerBoard.lines; i++) {
          for (let j = 0; j < board.playerBoard.columns; j++) {
            if (null === board.playerBoard.cards[i][j]) {
              const card = board.deck.pop();
              self.sendBoardUpdate(i, j, card.num);
            }
          }
        }
        self.sendBoardReady();
      }
    }, 10000);*/
  }
  timeSync(timeLeft: number): void {
   // this.scene.header.text = `[${this.scene.player.name}]: TIME LEFT: {timeLeft}`;
  }
  steps(steps: StepModel[]): void {
    //this.scene.header.text = `[${this.scene.player.name}]: REPLY STEPS`;
  }
  complete(winnerId: string): void {
    //this.scene.gameFinished = true;
    //this.scene.header.text = `[${this.scene.player.name}]: WINNER: ${winnerId}`;
    this.disconnect();
  }

  connected(): void {
    console.log('connected');
  }

  disconnected(): void {
    console.log('disconnected');
  }
}
