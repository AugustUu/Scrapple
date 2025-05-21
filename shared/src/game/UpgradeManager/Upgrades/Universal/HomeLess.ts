import { Bullet, State, Player, GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class HomeLess extends Upgrade {
    constructor() {
        super("HomeLess", 3, null, null, "Home Less")
    }

    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player): void {
        bullet.homeStrength *= -0.2 - (0.05 * level)
        bullet.homeRadius *= 1 + (0.2 * level)
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.damage *= 1 + (0.5 * level)
    }
}