import { Gun } from "shared/src/game/GunManager/Gun"
import { Upgrade } from "shared/src/game//UpgradeManager/Upgrade"
import { Upgrades } from "shared/src/game//UpgradeManager/UpgradeManager"
import { Networking } from "../networking/Networking"
import { C2SPacket } from "shared/src/networking/Packet"
import { Random } from "excalibur"
import { Guns } from "shared/src/game/GunManager/GunManager"

export class Inventory {
    static gun: Gun
    static upgrades: Map<string, Upgrade>
    static usableUpgrades: Map<string, Upgrade>
    static random: Random;
    static reloading: boolean;

    static init() {
        Inventory.upgrades = Upgrades
        this.random = new Random;
    }

    static updateUsableUpgrades(){
        Inventory.usableUpgrades = new Map(this.upgrades)
        for(let upgrade of this.upgrades){
            if(upgrade[1].level >= upgrade[1].max){
                this.usableUpgrades.delete(upgrade[0])
                continue
            }
            if(upgrade[1].upgradeDep != undefined){
                let dep = upgrade[1].upgradeDep
                if(Inventory.upgrades.get(dep.upgrade).level < dep.level){
                    this.usableUpgrades.delete(upgrade[0])
                    continue
                }
            }
            if(upgrade[1].gunDep != undefined){
                let dep = upgrade[1].gunDep
                if(Inventory.GetGun().name != dep){
                    this.usableUpgrades.delete(upgrade[0])
                    continue
                }
            }
        }
    }

    static Shoot(angle: number) {
        /*
        let gun = this.gun;
        if(!this.reloading){
                if (gun.shotsSinceLastReload < gun.magSize){
                if (Date.now() > gun.timeSinceLastShot + gun.fireRate * 1000 * (1 - (0.1 * Inventory.GetUpgrade("ShootSpeed").level))) {
                    let x = 0
                    while (x < gun.bulletsPerShot) {
                        Networking.client.room?.send(C2SPacket.Shoot, { angle: (angle - Math.PI) + (this.random.floating(gun.spread * -1, gun.spread + 1) * (Math.PI / 180)) })
                        x += 1
                    }

                    gun.timeSinceLastShot = Date.now()
                    gun.shotsSinceLastReload += 1
                }
            }
            else{
                this.Reload()
            }
        }*/
        Networking.client.room?.send(C2SPacket.Shoot, { angle: angle - Math.PI })
    }

    static Reload() {
        /*
        if (!this.reloading && this.gun.shotsSinceLastReload > 0) {
            this.reloading = true;
            console.log("reloading...")
            if(Inventory.GetUpgrade("ReloadBurst").level == 1 && this.gun.shotsSinceLastReload == this.gun.magSize){
                for(let i = 0; i < 5; i++){
                    Networking.client.room?.send(C2SPacket.Shoot, { angle: (this.random.floating(0, Math.PI * 2)) })
                }
            }
            setTimeout(() => {
                this.reloading = false;
                this.gun.shotsSinceLastReload = 0
                console.log("reloaded!")
            }, this.gun.timeToReload * 1000 * (1 - (0.1 * Inventory.GetUpgrade("ReloadSpeed").level)))
        }
        else {
            return
        }*/
        Networking.client.room?.send(C2SPacket.Reload, {})
    }

    static GetGun() {
        let id = Networking.client.room.state.players.get(Networking.client.clientId).gun.gunID
        return Guns.get(id)
    }

    static GetUpgrade(upgrade: string) {
        return Inventory.upgrades.get(upgrade)
    }

    static ChangeGun(gunID: string) {
        Networking.client.room?.send(C2SPacket.SwapGun, { id: gunID })
        //Inventory.gun = newGun
    }

    static LevelUpgrade(upgradeName: string) {
        let upgrade = Inventory.upgrades.get(upgradeName)
        if (upgrade.level < upgrade.max) {
            upgrade.level += 1
            console.log("upgraded " + upgradeName + " to " + (upgrade.level))
        }
    }
}