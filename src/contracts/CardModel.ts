import {CardStatsModel} from "@/contracts/CardStatsModel.ts";

export class CardModel {
    /** Идентификатор карты на сервере */
    readonly num: number;
    /** Описатель визуального представления карты */
    readonly skin: string;
    /** Характеристики карты. Для имен используются значения из CardStatName */
    readonly stats: CardStatsModel;

    constructor (
        id: number,
        attack: number,
        health: number,
        speed: number,
        distance: number,
        skin: string
    ) {
        this.num = id;
        this.stats = new CardStatsModel(attack, health, speed, distance);
        this.skin = skin;
    }
}

export class CardModelDrag extends CardModel {
    /** Возможность перемещать карту */
    draggable: boolean;

    constructor(card: CardModel, drag: boolean) {
        super(
            card.num,
            card.stats.atk,
            card.stats.hp,
            card.stats.spd,
            card.stats.dis,
            card.skin
        );
        this.draggable = drag;
    }
}