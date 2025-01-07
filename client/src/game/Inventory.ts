import { Gun } from "./GunManager/Gun"
import { Upgrade } from "./UpgradeManager/Upgrade"
import { Upgrades } from "./UpgradeManager/UpgradeManager"

export class Inventory {
    static gun: Gun
    static upgrades: Map<string,Upgrade>

    static init() {
        Inventory.upgrades = Upgrades
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
    }
}