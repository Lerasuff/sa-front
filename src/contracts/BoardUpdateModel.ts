export class BoardUpdateModel {
    public readonly line: number;
    public readonly pos: number;
    public readonly cardId: number;

    constructor(line: number, pos: number, cardId: number) {
        this.line = line;
        this.pos = pos;
        this.cardId = cardId;
    }
}