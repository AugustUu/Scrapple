import { Gun } from "shared/src/game/GunManager/Gun"
import { Upgrade } from "shared/src/game//UpgradeManager/Upgrade"
import { Upgrades } from "shared/src/game//UpgradeManager/UpgradeManager"
import { Networking } from "../networking/Networking"
import { C2SPacket } from "shared/src/networking/Packet"
import { Random } from "excalibur"

export class Inventory {
    static gun: Gun
    static upgrades: Map<string,Upgrade>
    static random: Random;
    static reloading: boolean;

    static init() {
        Inventory.upgrades = Upgrades
        this.random = new Random;
    }

    static Shoot(angle: number){
        let gun = this.gun;
        if (gun.shotsSinceLastReload < gun.magSize && !this.reloading) {
            if (Date.now() > gun.timeSinceLastShot + gun.fireRate * 1000) {
                let x = 0
                while (x < gun.bulletsPerShot) {
                    Networking.client.room?.send(C2SPacket.Shoot, { angle: (angle - Math.PI) + (this.random.floating(gun.spread * -1, gun.spread + 1) * (Math.PI / 180)) })
                    x += 1
                }

                gun.timeSinceLastShot = Date.now()
                gun.shotsSinceLastReload += 1
            }
        }
        else if (!this.reloading) {
            this.Reload()
        }
    }

    static Reload() {
        if (!this.reloading) {
            this.reloading = true;
            console.log("reloading...")
            setTimeout(() => {
                this.reloading = false;
                this.gun.shotsSinceLastReload = 0
                console.log("reloaded!")
            }, this.gun.timeToReload * 1000)
        }
        else {
            return
        }

    }

    static GetGun() {
        return Inventory.gun
    }

    static GetUpgrade(upgrade: string) {
        return Inventory.upgrades.get(upgrade)
    }

    static ChangeGun(newGun: Gun) {
        Inventory.gun = newGun
    }

    static LevelUpgrade(upgrade: string) {
        Inventory.upgrades.get(upgrade).level += 1
        console.log("upgraded " + upgrade + " to " + (Inventory.upgrades.get(upgrade).level))
    }
}