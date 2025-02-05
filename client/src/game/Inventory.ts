import { Gun } from "shared/src/game/GunManager/Gun"
import { Upgrade } from "shared/src/game//UpgradeManager/Upgrade"
import { Upgrades } from "shared/src/game//UpgradeManager/UpgradeManager"
import { Networking } from "../networking/Networking"
import { C2SPacket } from "shared/src/networking/Packet"
import { Guns } from "shared/src/game/GunManager/GunManager"
import { GunState } from "server/src/State"

export class Inventory {
    public upgrades: Map<string, Upgrade>
    public usableUpgrades: Map<string, Upgrade>

    private weaponDisplay!: HTMLElement;
    private ammoCounter!: HTMLElement; 

    public constructor() {
        this.upgrades = Upgrades

        this.weaponDisplay = document.getElementById('weaponDisplay')
        this.ammoCounter = document.getElementById('ammoCounter')

        Networking.client.room!.state.players.get(Networking.client.clientId).gun.onChange(() => {
            let gun = Networking.client.room!.state.players.get(Networking.client.clientId).gun
            this.weaponDisplay.innerHTML = `Weapon: ${gun.gunID}`

            if((gun.lastTimeReloaded + gun.reloadDelay) < Date.now()){
                this.ammoCounter.innerHTML = `Ammo: ${gun.ammo}/${Guns.get(gun.gunID).magSize}`

            }else{
                this.ammoCounter.innerHTML = `Reloading ...`


            }
        })
    }

    public updateUsableUpgrades(){
        this.usableUpgrades = new Map(this.upgrades)
        for(let upgrade of this.upgrades){
            if(upgrade[1].level >= upgrade[1].max){
                this.usableUpgrades.delete(upgrade[0])
                continue
            }
            if(upgrade[1].upgradeDep != undefined){
                let dep = upgrade[1].upgradeDep
                if(this.upgrades.get(dep.upgrade).level < dep.level){
                    this.usableUpgrades.delete(upgrade[0])
                    continue
                }
            }
            if(upgrade[1].gunDep != undefined){
                let dep = upgrade[1].gunDep
                if(this.GetGun().name != dep){
                    this.usableUpgrades.delete(upgrade[0])
                    continue
                }
            }
        }
    }

    public Shoot(angle: number) {
        Networking.client.room?.send(C2SPacket.Shoot, { angle: angle - Math.PI })
    }

    public Reload() {
        Networking.client.room?.send(C2SPacket.Reload, {})
    }

    public GetGun() {
        let id = Networking.client.room.state.players.get(Networking.client.clientId).gun.gunID
        return Guns.get(id)
    }

    public GetUpgrade(upgrade: string) {
        return this.upgrades.get(upgrade)
    }

    public ChangeGun(gunID: string) {
        Networking.client.room?.send(C2SPacket.SwapGun, { id: gunID })
        //this.gun = newGun
    }

    public LevelUpgrade(upgradeName: string) {
        let upgrade = this.upgrades.get(upgradeName)
        if (upgrade.level < upgrade.max) {
            upgrade.level += 1
            console.log("upgraded " + upgradeName + " to " + (upgrade.level))
        }
    }
}