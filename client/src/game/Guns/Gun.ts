import { Networking } from "../../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";
import { Random } from "excalibur";

export class Gun {
    name: String;
    damage: number;
    fireRate: number;
    magSize: number;
    spread: number;
    bulletsPerShot: number;
    automatic: boolean;

    random: Random

    constructor(name: String, damage: number, fireRate: number, magSize: number, spread: number, bulletsPerShot: number, automatic: boolean){
        this.name = name
        this.damage = damage
        this.fireRate = fireRate
        this.magSize = magSize
        this.spread = spread
        this.bulletsPerShot = bulletsPerShot
        this.automatic = automatic

        this.random = new Random
    }

    Shoot(angle: number){
        let x = 0
        while(x < this.bulletsPerShot){
            Networking.client.room?.send(C2SPacket.Shoot, { angle: angle + this.random.floating(this.spread * -1, this.spread + 1) * (Math.PI / 180)})
            x += 1
        }
        
    }

    Reload(){

    }
}