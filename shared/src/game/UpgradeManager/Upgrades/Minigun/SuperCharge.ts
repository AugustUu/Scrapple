import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { GunState, Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SuperCharge extends Upgrade {
    constructor() {
        super("SuperCharge", 3, null, "Minigun", "Shoot faster, smaller bullets")
    }
    
    clientOnPlayerConstructed(level: number, player: LocalPlayer){
        player.speed /= 1 + (0.05*level)
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.fireDelay -= (100*level)
        gun.bulletSize -= 0.5 * level
    }

}