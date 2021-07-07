export class BoardUpdateModel {
  public readonly moveId: number;
  public readonly line: number;
  public readonly pos: number;
  public readonly cardId: number;

  constructor(moveId: number, line: number, pos: number, cardId: number) {
    this.moveId = moveId;
    this.line = line;
    this.pos = pos;
    this.cardId = cardId;
  }
}
