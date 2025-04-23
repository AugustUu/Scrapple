import { GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class AllForOne extends Upgrade {
    constructor() {
        super("All For One", 1, null, "Shotgun", "Cram your magazine into one giant bullet")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletSize *= (gun.bulletsPerShot/2)
        gun.bulletSpeedMultiplier /= (gun.bulletsPerShot/4)
        gun.damage *=  (gun.bulletsPerShot/4)
        
        gun.bulletsPerShot = 1  
        gun.reloadDelay *= 2

    }
}