import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Tank extends Upgrade {
    constructor() {
        super("Tank", 1)
    }


    serverOnPlayerConstructed(level: number, player: Player): void {
        player.maxHealth += 50 * level;
        player.health += 50 * level;
        player.radius += 5 * level
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.speedMult -= 0.3 * level
    }
}