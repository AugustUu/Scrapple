import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer"
import { Player } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class AntsInYoPants extends Upgrade {
    constructor() {
        super("AntsInYoPants", 1, null, null, "Shadows jump twice")
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.maxJumps += level
    }
}