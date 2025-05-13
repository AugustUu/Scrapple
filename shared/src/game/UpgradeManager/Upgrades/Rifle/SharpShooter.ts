import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Bullet, GunState, Player, State } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SharpShooter extends Upgrade {
    constructor() {
        super("Sharp Shooter", 3, null, "Rifle", "Increased accuracy but no full auto")
    }

    serverOnGunConstructed(level: number, gun: GunState): void {
        gun.automatic = false
        gun.spread = Math.min(0, gun.spread - (-3 * level))
    }

}