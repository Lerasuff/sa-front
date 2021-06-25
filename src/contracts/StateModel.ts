import {CardModel} from "@/contracts/CardModel.ts";
import {BoardModel} from "@/contracts/BoardModel.ts";

export class StateModel {
    /** Описание состояния колоды */
    public readonly deck: CardModel[];
    /** Количество ед. здоровья игрока */
    public readonly playerHealth: number;
    /** Количество ед. здоровья противника */
    public readonly enemyHealth: number;
    /** Описание состояния игровой доски игрока */
    public readonly playerBoard: BoardModel;
    /** Описание состояния игровой доски противника */
    public readonly enemyBoard: BoardModel;

    constructor(
        deck: CardModel[],
        playerHealth: number,
        enemyHealth: number,
        playerBoard: BoardModel,
        enemyBoard: BoardModel,
    ) {
        this.deck = deck;
        this.playerHealth = playerHealth;
        this.enemyHealth = enemyHealth;
        this.playerBoard = playerBoard;
        this.enemyBoard = enemyBoard;
    }
}