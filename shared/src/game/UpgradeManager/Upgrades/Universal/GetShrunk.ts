import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class GetShrunk extends Upgrade {
    constructor() {
        super("Get Shrunk", 3, null, null, "Get skrunk")
    }


    serverOnPlayerConstructed(level: number, player: Player): void {
        player.maxHealth -= Math.pow(level, 0.5) * 30;
        player.health -= Math.pow(level, 0.5) * 30;
        player.radius -= Math.pow(level, 0.5) * 5
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.speedMult += 0.1 * level
        player.jumpHeight += 10 * level
    }
}