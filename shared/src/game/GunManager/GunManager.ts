import { Gun } from "./Gun";
import("./Guns/Pistol")
import("./Guns/Rifle")
import("./Guns/Shotgun")
import("./Guns/Sniper")


export const Guns: Map<string, Gun> = new Map()

export function registerGun(target: typeof Gun) {
    let gun = new target();
    //console.log("registered gun", gun)
    Guns.set(target.name, gun)
}