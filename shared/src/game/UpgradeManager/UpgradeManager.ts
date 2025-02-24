import { Upgrade } from "./Upgrade";

export const Upgrades: Map<string,Upgrade> = new Map()
import("./Upgrades/Jump")
import("./Upgrades/ReloadSpeed")
import("./Upgrades/ReloadBurst")
import("./Upgrades/ShootSpeed")
import("./Upgrades/Speed")
import("./Upgrades/Reversenizer")
import("./Upgrades/Tank")
import("./Upgrades/AntsInYoPants")

export function registerUpgrade(upgradeType: typeof Upgrade) {
    let upgrade = new upgradeType();
    //console.log("registered upgrade", upgrade)
    Upgrades.set(upgradeType.name,upgrade)
}
