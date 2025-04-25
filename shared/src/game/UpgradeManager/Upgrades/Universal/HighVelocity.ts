import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { GunState } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class HighVelocity extends Upgrade {
    constructor() {
        super("HighVelocity", 3, null, null, "You and your bullets move faster")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.bulletSpeedMultiplier *= (1 + (2/3) * level)
        gun.reloadDelay += 300 * level
    }
    
    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.speed += level * 1.5
    }
}