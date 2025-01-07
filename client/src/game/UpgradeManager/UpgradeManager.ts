import { Upgrade } from "./Upgrades/Upgrade";
import("./Upgrades/Speed")

export const Upgrades: Map<string,Upgrade> = new Map()

export function registerUpgrade(target: typeof Upgrade) {
    let upgrade = new target();
    console.log("registered upgrade", upgrade)
    Upgrades.set(target.name,upgrade)
}

