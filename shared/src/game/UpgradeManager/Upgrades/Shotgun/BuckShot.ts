import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"
import { GunState } from "../../../../../../server/src/State"

@registerUpgrade
export class BuckShot extends Upgrade {
    constructor() {
        super("Buck Shot", 1, null, "Shotgun", "Larger bullets means you can only fit so many in one shell")
        //less spread less bullets more damage
        
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletsPerShot -= 2
        gun.damage *= 1.25
        gun.spread *= 0.75
    }
}