import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class GetShrunk extends Upgrade {
    constructor() {
        super("Get Shrunk", 3)
    }


    serverOnPlayerConstructed(level: number, player: Player): void {
        player.maxHealth -= 30 * level;
        player.health -= 30 * level;
        player.radius -= 5 * level
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.speedMult += 0.2 * level
    }
}