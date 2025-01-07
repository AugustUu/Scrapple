import { Upgrade } from "./Upgrade";
import("./Speed")

export const Upgrades: Map<string,Upgrade> = new Map()

export function registerUpgrade(target: typeof Upgrade) {
    let upgrade = new target();
    console.log("registered upgrade", upgrade)
    Upgrades.set(target.name,upgrade)
}

