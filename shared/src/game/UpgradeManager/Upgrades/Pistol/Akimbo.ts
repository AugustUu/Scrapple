import { GunState, Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Akimbo extends Upgrade {
    constructor() {
        super("Akimbo", 3, null, "Pistol")
    }
    
    serverOnPlayerConstructed(level: number, player: Player): void {
        //player.

    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.damage /= (1.5 * level)
        gun.bulletsPerShot *= level*2
        gun.spread *= (1.1*level)
    }
}