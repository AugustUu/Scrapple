import { Gun } from "./Gun";
import("./Guns/Pistol")
import("./Guns/Rifle")
import("./Guns/Shotgun")
import("./Guns/Sniper")


export const Guns: Map<string, Gun> = new Map()
export const idList: Array<string> = new Array()

export function registerGun(target: typeof Gun) {
    let gun = new target();
    idList.push(target.name)
    //console.log("registered gun", gun)
    Guns.set(target.name, gun)
}