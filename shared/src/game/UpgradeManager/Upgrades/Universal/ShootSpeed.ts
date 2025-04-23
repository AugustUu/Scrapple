import { GunState } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class ShootSpeed extends Upgrade {
    constructor() {
        super("ShootSpeed", 5, null, null, "Shoot speedier")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletSpeedMultiplier += level
    }

}