import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { GunState, Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class AmmoBelt extends Upgrade {
    constructor() {
        super("AmmoBelt", 3, null, "Minigun", "Take a heavy ammo belt")
    }
    
    clientOnPlayerConstructed(level: number, player: LocalPlayer){
        player.speed /= 1 + (0.05*level)
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.ammo += 25 * level
        gun.reloadDelay *= 1 + (0.15 * level)
    }

    
}