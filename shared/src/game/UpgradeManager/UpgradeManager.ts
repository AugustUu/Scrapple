import { Upgrade } from "./Upgrade";

export const Upgrades: Map<string,Upgrade> = new Map()

import("./Upgrades/Universal/JumpBoost")
import("./Upgrades/Universal/ReloadSpeed")
import("./Upgrades/Universal/HighVelocity")
import("./Upgrades/Universal/HighVelocity")
import("./Upgrades/Universal/Tank")
import("./Upgrades/Universal/GrappleCooldown")
import("./Upgrades/Universal/Regen")
import("./Upgrades/Universal/SprayAndPray")


import("./Upgrades/Pistol/GlassCannon")

import("./Upgrades/Sniper/Reversenizer")

import("./Upgrades/Shotgun/ReloadBurst")

import("./Upgrades/AntsInYoPants")


export function registerUpgrade(upgradeType: typeof Upgrade) {
    let upgrade = new upgradeType();
    //console.log("registered upgrade", upgrade)
    Upgrades.set(upgradeType.name,upgrade)
}
