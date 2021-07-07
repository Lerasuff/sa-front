import { BoardModel, BoardModelDrag } from '@/contracts/BoardModel.ts';
import { CardModel, CardModelDrag } from '@/contracts/CardModel.ts';
import { createModule, ModuleInstance } from 'vuexok';
import store from '@/store';
import { Mutations } from '@/store/consts.ts';
import moment from 'moment';

const emptyBoard = (line, col) => {
  const result: null[][] = [];
  for (let i = 0; i < line; i++) {
    const item: null[] = [];
    for (let j = 0; j < col; j++) {
      item.push(null);
    }
    result.push(item);
  }
  return result;
};

export class BoardState {
  playerBoard: BoardModelDrag = new BoardModelDrag(new BoardModel(2, 8, emptyBoard(2, 8)), true);
  enemyBoard: BoardModelDrag = new BoardModelDrag(new BoardModel(2, 8, emptyBoard(2, 8)), false);
  deck: CardModelDrag[] = [];
  enemyHealth = 0;
  playerHealth = 0;
  needUpdate = false;
  gameFinished = false;
  isWinner = false;
  timeSync = '00:00';
}

export interface BoardModules {
  namespaced: true;
  state: BoardState;
  mutations: {
    [Mutations.SET_BOARD](state: BoardState, payload: { name: string; cards: BoardModel; drag: boolean });
    [Mutations.ADD_IN_BOARD](state: BoardState, payload: { line: number; col: number; card: CardModelDrag });
    [Mutations.DELETE_FROM_BOARD](state: BoardState, payload: { line: number; col: number });
    [Mutations.SET_DECK](state: BoardState, payload: { cards: CardModel[]; drag?: boolean });
    [Mutations.ADD_IN_DECK](state: BoardState, card: CardModelDrag);
    [Mutations.DELETE_FROM_DECK](state: BoardState, pos: number);
    [Mutations.SET_FINISH](state: BoardState, payload: { finish: boolean; update: boolean; win: boolean });
    [Mutations.SET_TIME](state: BoardState, time: number);
    [Mutations.SET_HEALTH](state: BoardState, payload: { enemyHealth: number; playerHealth: number });
    [Mutations.CLEAR_STATE](state: BoardState);
  };
}

const boardStateModule: ModuleInstance<BoardModules> = createModule(store, 'playerBoard', {
  namespaced: true,
  state: new BoardState(),
  mutations: {
    [Mutations.SET_BOARD](state, { name, cards, drag }) {
      state[name] = new BoardModelDrag(cards, drag);
    },
    [Mutations.ADD_IN_BOARD](state, { line, col, card }) {
      state.playerBoard.cards[line][col] = card;
    },
    [Mutations.DELETE_FROM_BOARD](state, { line, col }) {
      state.playerBoard.cards[line][col] = null;
    },
    [Mutations.SET_DECK](state, { cards, drag }) {
      const deck: CardModelDrag[] = [];
      cards.forEach((card) => {
        if (drag === undefined) drag = true;
        deck.push(new CardModelDrag(card, drag));
      });
      state.deck = deck;
    },
    [Mutations.ADD_IN_DECK](state, card) {
      if (card.num < state.deck[0].num) {
        state.deck.unshift(card);
      } else if (card.num > state.deck[state.deck.length - 1].num) {
        state.deck.push(card);
      } else {
        const index = state.deck.findIndex((el, ind, arr) => {
          return el.num > card.num && arr[ind - 1].num < card.num;
        });
        if (index > -1) state.deck.splice(index, 0, card);
        else state.deck.push(card);
      }
    },
    [Mutations.DELETE_FROM_DECK](state, pos) {
      state.deck.splice(pos, 1);
    },
    [Mutations.SET_FINISH](state, { finish, update, win }) {
      state.gameFinished = finish;
      state.needUpdate = update;
      state.isWinner = win;
    },
    [Mutations.SET_TIME](state: BoardState, time: number) {
      state.timeSync = moment.utc(time).format('mm:ss');
    },
    [Mutations.SET_HEALTH](state: BoardState, { enemyHealth, playerHealth }) {
      state.enemyHealth = enemyHealth;
      state.playerHealth = playerHealth;
    },
    [Mutations.CLEAR_STATE](state: BoardState) {
      state.playerBoard = new BoardModelDrag(new BoardModel(2, 8, emptyBoard(2, 8)), true);
      state.enemyBoard = new BoardModelDrag(new BoardModel(2, 8, emptyBoard(2, 8)), false);
      state.deck = [];
      state.enemyHealth = 0;
      state.playerHealth = 0;
      state.needUpdate = false;
      state.gameFinished = true;
      state.timeSync = '00:00';
    },
  },
});

export default boardStateModule;
