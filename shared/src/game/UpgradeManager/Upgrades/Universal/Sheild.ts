import { GunState, Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Sheild extends Upgrade {
    constructor() {
        super("Sheild", 5)
    }

    serverOnPlayerConstructed(level: number, player: Player): void {
        player.maxHealth += 20 * level;
    }
}