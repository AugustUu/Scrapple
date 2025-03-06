import { Upgrade } from "./Upgrade";

export const Upgrades: Map<string,Upgrade> = new Map()
import("./Upgrades/Universal/Jump")
import("./Upgrades/Universal/ReloadSpeed")
import("./Upgrades/ReloadBurst")
import("./Upgrades/Universal/ShootSpeed")
import("./Upgrades/Universal/Speed")
import("./Upgrades/Reversenizer")
import("./Upgrades/Universal/Tank")
import("./Upgrades/AntsInYoPants")

export function registerUpgrade(upgradeType: typeof Upgrade) {
    let upgrade = new upgradeType();
    //console.log("registered upgrade", upgrade)
    Upgrades.set(upgradeType.name,upgrade)
}
