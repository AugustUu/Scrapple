import { Gun } from "./Guns/Gun"
import { Upgrade } from "./UpgradeManager/Upgrades/Upgrade"
import { Upgrades } from "./UpgradeManager/UpgradeManager"

export class Inventory {
    static gun: Gun
    static upgrades: Upgrade[]

    constructor() {
        Inventory.upgrades = Array.from(Upgrades.values())
    }

    GetGun() {
        return Inventory.gun
    }

    GetUpgrades() {
        return Inventory.upgrades
    }

    ChangeGun(newGun: Gun) {
        Inventory.gun = newGun
    }


    ChangeUpgrade(indexNum: number, newUpgrade: Upgrade) {
        Inventory.upgrades[indexNum] = newUpgrade
    }
}