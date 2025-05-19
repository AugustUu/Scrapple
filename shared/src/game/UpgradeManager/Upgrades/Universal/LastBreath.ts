import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Player, State } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class LastBreath extends Upgrade {
    constructor() {
        super("LastBreath", 1, null, null, "Run faster but moving hurts")
    }

    serverOnServerTick(level: number, state: State, player: Player): void {
        let dist = Math.hypot(player.position.x - player.oldPosition.x,player.position.y - player.oldPosition.y)
        if(dist > 4){
            player.health -= 5/64
        }

    }

    

    clientOnPlayerConstructed(level: number, player: LocalPlayer): void {
        player.speedMult *= 1.5;
    }
}