

export class Gun {
    name: String;
    damage: number;
    fireRate: number;
    magSize: number;

    constructor(name: String, damage: number, fireRate: number, magSize: number){
        this.name = name
        this.damage = damage
        this.fireRate = fireRate
        this.magSize = magSize
    }
}