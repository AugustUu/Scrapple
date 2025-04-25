import { GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class OneForAll extends Upgrade {
    constructor() {
        super("One For All", 1, null, "Shotgun", "Just like in Skyblock")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletsPerShot += 2
        gun.magSize = 1
        gun.ammo = 1
        gun.reloadDelay *= 2
    }
}