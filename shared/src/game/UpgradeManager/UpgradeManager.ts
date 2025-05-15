import { Upgrade } from "./Upgrade";

export const Upgrades: Map<string,Upgrade> = new Map()


import("./Upgrades/Universal/AntsInYoPants")
import("./Upgrades/Universal/GetShrunk")
import("./Upgrades/Universal/Grappler")
import("./Upgrades/Universal/HighVelocity")
import("./Upgrades/Universal/HomeLess")
import("./Upgrades/Universal/JumpBoost")
import("./Upgrades/Universal/LuckyBullets")
import("./Upgrades/Universal/Regen")
import("./Upgrades/Universal/ReloadSpeed")
import("./Upgrades/Universal/SharpShooter")
import("./Upgrades/Universal/Shield")
import("./Upgrades/Universal/ShootSpeed")
import("./Upgrades/Universal/SprayAndPray")
import("./Upgrades/Universal/Tank")


import("./Upgrades/Pistol/Akimbo")
import("./Upgrades/Pistol/Bonk")
import("./Upgrades/Pistol/GlassCannon")


import("./Upgrades/Sniper/Dash")
import("./Upgrades/Sniper/FlankGuard")
import("./Upgrades/Sniper/Reversenizer")
import("./Upgrades/Sniper/Scope")


import("./Upgrades/Shotgun/AllForOne")
import("./Upgrades/Shotgun/BirdShot")
import("./Upgrades/Shotgun/BuckShot")
import("./Upgrades/Shotgun/OneForAll")
import("./Upgrades/Shotgun/ReloadBurst")
import("./Upgrades/Shotgun/SawedOff")


import("./Upgrades/Minigun/Ammobelt")
import("./Upgrades/Minigun/Porcupine")
import("./Upgrades/Minigun/SuperCharge")





export function registerUpgrade(upgradeType: typeof Upgrade) {
    let upgrade = new upgradeType();
    //console.log("registered upgrade", upgrade)
    Upgrades.set(upgrade.name,upgrade)
}
