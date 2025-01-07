import { Upgrade } from "./Upgrade";
import("./Upgrades/Speed")
import("./Upgrades/Jump")

export const Upgrades: Map<string,Upgrade> = new Map()

export function registerUpgrade(upgradeType: typeof Upgrade) {
    let upgrade = new upgradeType();
    console.log("registered upgrade", upgrade)
    Upgrades.set(upgradeType.name,upgrade)
}

