import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Grappler extends Upgrade {
    constructor() {
        super("Grappler", 10, null, null, "makes your grappling hook better")
    }


    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.maxGrappleSpeed += 25 * level
        player.grappleCooldown /= 2 * level
    }
}