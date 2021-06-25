import {CardStatsModel} from "@/contracts/CardStatsModel.ts";

const cardImages = [
    '01.png',
    '02.png',
    '03.png',
    '04.png',
    '05.png',
    '06.png',
    '07.png',
    '08.png',
]

export class CardModel {
    /** Идентификатор карты на сервере */
    readonly num: number;
    /** Описатель визуального представления карты */
    readonly skin: string;
    /** Характеристики карты. Для имен используются значения из CardStatName */
    readonly stats: CardStatsModel;
    /** Перемещение карты */
    draggable: boolean;

    constructor (
        id: number,
        attack: number,
        health: number,
        speed: number,
        distance: number,
        draggable:boolean
    ) {
        this.num = id;
        this.stats = new CardStatsModel(attack, health, speed, distance);
        this.skin = require(`@/assets/images/cards/${cardImages[this.num % cardImages.length]}`);
        this.draggable = draggable;
    }
}