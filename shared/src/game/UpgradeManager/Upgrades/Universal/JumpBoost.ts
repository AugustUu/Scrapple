import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class JumpBoost extends Upgrade {
    constructor() {
        super("JumpBoost", 3, null, null, "Reach for the stars")
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.jumpHeight += level * 20
    }
}