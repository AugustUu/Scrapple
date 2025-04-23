import { Bullet, State, Player, GunState } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class HomeLess extends Upgrade {
    constructor() {
        super("HomeLess", 3, null, null, "You'll never guess what this one does")
    }

    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player): void {
        bullet.homeStrength *= -0.25
        bullet.homeRadius *= 1.2
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.damage *= 1.5
    }
}