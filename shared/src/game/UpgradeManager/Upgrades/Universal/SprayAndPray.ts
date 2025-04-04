import { GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SprayAndPray extends Upgrade {
    constructor() {
        super("SprayAndPray", 3)
    }


    serverOnGunConstructed(level: number, gun: GunState) {
        gun.fireDelay -= 100 * level;
        gun.spread += 8 * level;
    }
}