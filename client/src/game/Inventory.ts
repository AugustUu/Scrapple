import { Gun } from "shared/src/game/GunManager/Gun"
import { Upgrade } from "shared/src/game//UpgradeManager/Upgrade"
import { Upgrades } from "shared/src/game//UpgradeManager/UpgradeManager"
import { Networking } from "../networking/Networking"
import { C2SPacket } from "shared/src/networking/Packet"
import { Guns } from "shared/src/game/GunManager/GunManager"
import { GunState, UpgradeState } from "server/src/State"

export class Inventory {
    public upgrades: Map<string, Upgrade>
    public usableUpgrades: Map<string, Upgrade>

    private weaponDisplay!: HTMLElement;
    private ammoCounter!: HTMLElement; 
    private healthBar!: HTMLElement;
    private upgradesList!: HTMLElement;
   

    public constructor() {
        this.upgrades = Upgrades
        

        this.weaponDisplay = document.getElementById('weaponDisplay')
        this.ammoCounter = document.getElementById('ammoCounter')
        this.healthBar = document.getElementById('healthBar')
        //this.upgradesList = document.getElementById('upgradesList')

        Networking.getLocalState().gun.onChange(() => {
            let gun = Networking.getLocalState().gun
            this.weaponDisplay.innerHTML = `Weapon: ${gun.gunID}`

            if((gun.lastTimeReloaded + gun.reloadDelay) < Date.now()){
                this.ammoCounter.innerHTML = `Ammo: ${gun.ammo}/${Guns.get(gun.gunID).magSize}`

            }else{
                this.ammoCounter.innerHTML = `Reloading ...`
            }
        })

        /*Stuff for upgrades list
        Networking.getLocalClient().upgrades.onChange(() => {
            this.upgradesList.innerHTML = ''
            for(let upgrade of Networking.getLocalClient().upgrades.values()){
                this.upgradesList.innerHTML += upgrade.upgradeID + "\n"
            }
        })*/

        Networking.getLocalState().onChange(() => {
            let health = Networking.getLocalState().health
            this.healthBar.innerHTML = `${health} / 100` // needs to change according to max health
        })
    }

    public Shoot(angle: number) {
        Networking.client.room?.send(C2SPacket.Shoot, { angle: angle - Math.PI })
    }

    public Reload() {
        Networking.client.room?.send(C2SPacket.Reload, {})
    }

    public GetGun() {
        let id = Networking.getLocalState().gun.gunID
        return Guns.get(id)
    }

    public GetUpgrade(upgrade: string) {
        return this.upgrades.get(upgrade)
    }

    public ChangeGun(gunID: string) {
        Networking.client.room?.send(C2SPacket.SwapGun, { id: gunID })
        //this.gun = newGun
    }
}