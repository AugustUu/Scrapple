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
    timeSinceReloadStarted: number;

    constructor(name: String, damage: number, fireRate: number, timeToReload: number, magSize: number, spread: number, bulletsPerShot: number, automatic: boolean){
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
        this.timeSinceReloadStarted = 0;
    }

    Shoot(angle: number){
        
        if(this.shotsSinceLastReload < this.magSize){
            if(Date.now() > this.timeSinceLastShot + this.fireRate * 1000){
                let x = 0
            while(x < this.bulletsPerShot){
                Networking.client.room?.send(C2SPacket.Shoot, { angle: angle + this.random.floating(this.spread * -1, this.spread + 1) * (Math.PI / 180)})
                x += 1
            }
            
            this.timeSinceLastShot = Date.now()
            this.shotsSinceLastReload += 1
            }
        }
        else if (!this.reloading){
            console.log("reloading...")
            this.reloading = true;
            this.timeSinceReloadStarted = Date.now()
        }
        
    }

    public Update(engine: Engine, delta: number){
        if(this.reloading){
            console.log("erm")
            if(Date.now() > this.timeSinceReloadStarted + this.timeToReload * 1000){
                console.log("reloaded!")
                this.reloading = false;
                this.shotsSinceLastReload = 0
            }
        }

    }

    
}