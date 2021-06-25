export class CardStatsModel {
    atk: number;
    hp: number;
    spd: number;
    dis: number;

    constructor(attack: number, health: number, speed: number, distance: number) {
        this.atk = attack;
        this.hp = health;
        this.spd = speed;
        this.dis = distance;
    }
}