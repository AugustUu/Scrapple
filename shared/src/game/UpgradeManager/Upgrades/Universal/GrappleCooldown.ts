import { Bullet, State, Player } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class GrappleCooldown extends Upgrade {
    constructor() {
        super("Grapple Cooldown", 3)
    }

    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player): void {
        bullet.speed *= 10
    }
}