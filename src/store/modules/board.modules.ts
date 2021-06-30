import {BoardModel, BoardModelDrag} from "@/contracts/BoardModel.ts";
import {CardModel, CardModelDrag} from "@/contracts/CardModel.ts";
import {createModule, ModuleInstance} from "vuexok";
import store from "@/store";
import {Mutations} from "@/store/consts.ts";

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
}

export class BoardState {
    playerBoard: BoardModelDrag = new BoardModelDrag(new BoardModel(2, 8, emptyBoard(2,8)), true);
    enemyBoard: BoardModelDrag = new BoardModelDrag(new BoardModel(2, 8, emptyBoard(2,8)), false);
    deck: CardModelDrag[] = [];
    needUpdate = true;
    gameFinished = false;
}

export interface BoardModules {
    namespaced: true;
    state: BoardState;
    getters: {
        playerBoard: (state: BoardState) => BoardModelDrag,
        enemyBoard: (state: BoardState) => BoardModelDrag,
        deck: (state: BoardState) => CardModelDrag[],
        needUpdate: (state: BoardState) => boolean,
        gameFinished: (state: BoardState) => boolean
    };
    mutations: {
        [Mutations.SET_BOARD](state: BoardState, payload: {name: string, cards: BoardModel, drag: boolean}),
        [Mutations.SET_DECK](state: BoardState, payload: {cards: CardModel[], drag: boolean}),
        [Mutations.SET_UPDATE](state: BoardState, need: boolean),
        [Mutations.SET_FINISH](state: BoardState, finish: boolean),
    };
}

const boardStateModule: ModuleInstance<BoardModules> = createModule(store,'board',{
    namespaced: true,
    state: new BoardState(),
    getters: {
        playerBoard: (state) => state.playerBoard,
        enemyBoard: (state) => state.enemyBoard,
        deck: (state) => state.deck,
        needUpdate: (state) => state.needUpdate,
        gameFinished: (state) => state.gameFinished,
    },
    mutations: {
        [Mutations.SET_BOARD](state, {name, cards, drag}) {
            state[name] = new BoardModelDrag(cards, drag);
        },
        [Mutations.SET_DECK](state, {cards, drag}) {
            const deck: CardModelDrag[] = [];
            cards.forEach(card => {
                deck.push(new CardModelDrag(card, drag));
            })
            state.deck = deck;
        },
        [Mutations.SET_UPDATE](state, need) {
            state.needUpdate = need;
        },
        [Mutations.SET_FINISH](state, finish) {
            state.gameFinished = finish;
        },
    },
});

export default boardStateModule;