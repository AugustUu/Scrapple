import { GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class OneForAll extends Upgrade {
    constructor() {
        super("OneForAll", 1, null, "Shotgun")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletsPerShot *= gun.magSize
        gun.magSize = 1
        gun.ammo = 1
        gun.reloadDelay *= 2
    }
}