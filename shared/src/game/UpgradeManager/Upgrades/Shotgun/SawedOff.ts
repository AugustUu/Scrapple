import { GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SawedOff extends Upgrade {
    constructor() {
        super("Sawed-Off", 1,null,"Shotgun")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletsPerShot += 2
        gun.spread *= 1.5
        gun.bulletSpeedMultiplier *= 0.9
    }
}