export class Gun {
    name: String;
    damage: number;
    fireRate: number;
    magSize: number;
    timeToReload: number;
    spread: number;
    bulletsPerShot: number;
    automatic: boolean;

    timeSinceLastShot: number;
    shotsSinceLastReload: number;

    constructor(name: String = "ERROR", damage: number = 10, fireRate: number = 0.5, timeToReload: number = 1, magSize: number = 10, spread: number = 0, bulletsPerShot: number = 1, automatic: boolean = false) {
        if(name == "ERROR"){
            console.error("GUN HAS NO NAME YO, FIX IT")
        }
        this.name = name
        this.damage = damage
        this.fireRate = fireRate
        this.timeToReload = timeToReload
        this.magSize = magSize
        this.spread = spread
        this.bulletsPerShot = bulletsPerShot
        this.automatic = automatic

        this.timeSinceLastShot = 0;
        this.shotsSinceLastReload = 0;

    }



}