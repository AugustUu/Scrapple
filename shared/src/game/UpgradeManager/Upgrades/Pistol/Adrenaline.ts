import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { GunState, Player, State } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Adrenaline extends Upgrade {
    constructor() {
        super("Adrenaline", 3, null, null, "UNIMPLEMENTED")
    }

    serverOnServerTick(level: number, state: State, player: Player): void {
        if (player.health < player.maxHealth/3) {
            //state.
        }
    }
}