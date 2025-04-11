import { Upgrade } from "./Upgrade";

export const Upgrades: Map<string,Upgrade> = new Map()


import("./Upgrades/Universal/JumpBoost")
import("./Upgrades/Universal/ReloadSpeed")
import("./Upgrades/Universal/HighVelocity")
import("./Upgrades/Universal/Tank")
import("./Upgrades/Universal/GrappleCooldown")
import("./Upgrades/Universal/Regen")
import("./Upgrades/Universal/SprayAndPray")
import("./Upgrades/Universal/Sheild")
import("./Upgrades/Universal/HomeLess")


import("./Upgrades/Pistol/GlassCannon")
import("./Upgrades/Pistol/Akimbo")

import("./Upgrades/Sniper/Reversenizer")
import("./Upgrades/Sniper/Scope")


import("./Upgrades/Shotgun/ReloadBurst")
import("./Upgrades/Shotgun/OneForAll")
import("./Upgrades/Shotgun/AllForOne")
import("./Upgrades/Shotgun/BirdShot")
import("./Upgrades/Shotgun/BuckShot")
import("./Upgrades/Shotgun/SawedOff")

import("./Upgrades/Minigun/Ammobelt")



import("./Upgrades/AntsInYoPants")


export function registerUpgrade(upgradeType: typeof Upgrade) {
    let upgrade = new upgradeType();
    //console.log("registered upgrade", upgrade)
    Upgrades.set(upgrade.name,upgrade)
}
