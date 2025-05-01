import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Dash extends Upgrade {
    constructor() {
        super("Dash", 5, null, "Sniper", "Hit 'Q' to fling yourself in the direction of your mouse")
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.maxDashes = level
    }
}