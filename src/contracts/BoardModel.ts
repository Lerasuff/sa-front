import {CardModel, CardModelDrag} from "@/contracts/CardModel.ts";

export class BoardModel {
    lines: number;
    columns: number;
    cards: (CardModel | null)[][];

    constructor(lines: number, cols: number, cards: (CardModel | null)[][]) {
        this.lines = lines;
        this.columns = cols;
        this.cards = cards;
    }
}

export class BoardModelDrag {
    lines: number;
    columns: number;
    cards: (CardModelDrag | null)[][];

    constructor(board: BoardModel, drag: boolean) {
        this.lines = board.lines;
        this.columns = board.columns;

        const boardCard = board.cards;
        this.cards = [];
        boardCard.forEach(line => {
            const lineCard: (CardModelDrag | null)[] = [];
            line.forEach(card => {
                if (card)
                    lineCard.push(new CardModelDrag(card, drag));
                else
                    lineCard.push(null);
            });
            this.cards.push(lineCard);
        })
    }
}