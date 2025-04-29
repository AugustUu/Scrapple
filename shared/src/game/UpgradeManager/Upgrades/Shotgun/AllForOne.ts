import { GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class AllForOne extends Upgrade {
    constructor() {
        super("All For One", 1, null, "Shotgun", "Shoot one giant bullet")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletSize *= (gun.bulletsPerShot/2)
        gun.bulletSpeedMultiplier /= (gun.bulletsPerShot/4)
        gun.damage *=  (gun.bulletsPerShot)
        
        gun.bulletsPerShot = 1
        gun.reloadDelay *= 2

    }
}