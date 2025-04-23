import { GunState, Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Shield extends Upgrade {
    constructor() {
        super("Shield", 5,null,null,"gives a little more max health")
    }

    serverOnPlayerConstructed(level: number, player: Player): void {
        player.maxHealth += 20 * level;
    }
}