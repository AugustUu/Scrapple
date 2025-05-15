import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Bullet, GunState, Player, State } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SharpShooter extends Upgrade {
    constructor() {
        super("Sharp Shooter", 3, null, null, "Increased accuracy but slower reloads")
    }

    serverOnGunConstructed(level: number, gun: GunState): void {
        gun.spread = Math.min(0, gun.spread - (-3 * level))
        gun.reloadDelay += 250 * level
    }

}