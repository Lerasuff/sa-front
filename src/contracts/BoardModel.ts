import {CardModel} from "@/contracts/CardModel.ts";

export class BoardModel {
    public readonly lines: number;
    public readonly columns: number;
    public readonly cards: (CardModel | undefined)[][];

    constructor(lines: number, cols: number, cards: (CardModel | undefined)[][]) {
        this.lines = lines;
        this.columns = cols;
        this.cards = cards;
    }
}