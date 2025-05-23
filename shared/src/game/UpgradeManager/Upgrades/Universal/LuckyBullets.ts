import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Bullet, GunState, Player, State } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class LuckyBullets extends Upgrade {
    constructor() {
        super("Lucky Bullets", 3, null, null, "Better chance of not missing")
    }

    serverOnGunConstructed(level: number, gun: GunState): void {
        gun.magSize = Math.round(gun.magSize / 2 )
        gun.ammo = gun.magSize
    }

    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player): void {
        bullet.homeStrength *= 1 + (0.3 * level)
        bullet.homeRadius *= 1 + (0.2 * level)
    }
}