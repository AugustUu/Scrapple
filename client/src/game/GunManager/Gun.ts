import { Networking } from "../../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";
import { Engine, Random } from "excalibur";
import { time } from "console";

export class Gun {
    name: String;
    damage: number;
    fireRate: number;
    magSize: number;
    timeToReload: number;
    spread: number;
    bulletsPerShot: number;
    automatic: boolean;

    random: Random;
    timeSinceLastShot: number;

    reloading: boolean;
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

        this.random = new Random;
        this.timeSinceLastShot = 0;

        this.reloading = false;
        this.shotsSinceLastReload = 0;

    }

    Shoot(angle: number) {

        if (this.shotsSinceLastReload < this.magSize && !this.reloading) {
            if (Date.now() > this.timeSinceLastShot + this.fireRate * 1000) {
                let x = 0
                while (x < this.bulletsPerShot) {
                    Networking.client.room?.send(C2SPacket.Shoot, { angle: (angle - Math.PI) + (this.random.floating(this.spread * -1, this.spread + 1) * (Math.PI / 180)) })
                    x += 1
                }

                this.timeSinceLastShot = Date.now()
                this.shotsSinceLastReload += 1
            }
        }
        else if (!this.reloading) {
            this.Reload()
        }

    }

    public Reload() {
        if (!this.reloading) {
            this.reloading = true;
            console.log("reloading...")
            setTimeout(() => {
                this.reloading = false;
                this.shotsSinceLastReload = 0
                console.log("reloaded!")
            }, this.timeToReload * 1000)
        }
        else {
            return
        }

    }


}