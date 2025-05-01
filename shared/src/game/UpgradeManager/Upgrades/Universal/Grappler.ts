import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Grappler extends Upgrade {
    constructor() {
        super("Grappler", 10, null, null, "UNIMPLEMENTED")
    }


    serverOnPlayerConstructed(level: number, player: Player): void {
        player.maxHealth += 50 * level;
        player.health += 50 * level;
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.speedMult -= 0.3 * level
    }
}