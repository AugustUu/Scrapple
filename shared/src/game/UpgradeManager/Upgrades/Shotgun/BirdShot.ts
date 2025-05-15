import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"
import { GunState } from "../../../../../../server/src/State"

@registerUpgrade
export class BirdShot extends Upgrade {
    constructor() {
        super("Bird Shot", 1, null, "Shotgun", "If your bullets are smaller you can pack more in a shell")
        //more bullets more spread less damage
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletsPerShot += 3
        gun.damage *= 0.8
        gun.spread *= 1.25
    }
}