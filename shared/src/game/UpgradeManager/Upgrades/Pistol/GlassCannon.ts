import { GunState, Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class GlassCannon extends Upgrade {
    constructor() {
        super("GlassCannon", 3, null, "Like a wizard")
    }
    
    serverOnPlayerConstructed(level: number, player: Player): void {
        player.maxHealth / (level + 1);
        player.health / (level + 1);

    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.damage *= (level + 0.5)
    }
}