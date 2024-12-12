import { Gun } from "./Guns/Gun"
import { Upgrade } from "./Upgrades/Upgrade"

export class Inventory{
    static gun: Gun
    static upgrades: Upgrade[]

    constructor(gun: Gun, upgrades: Upgrade[]){
        Inventory.gun = gun
        Inventory.upgrades = upgrades
    }

    ChangeGun(newGun: Gun){
        Inventory.gun = newGun
    }

    ChangeUpgrade(indexNum: number, newUpgrade: Upgrade){
        Inventory.upgrades[indexNum] = newUpgrade
    }
}